import { Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { NotFoundError } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService){};

    async getCart(user){
        const cart = await this.prisma.cart.findFirst({
            where: {
                userId: user.id,
                isDeleted: false
            },
            select: {
                CartItems: {
                    select: {
                        id: true,
                        product: {
                            select: {
                                name: true,
                                price: true
                            }
                        },
                        total_price: true,
                        total_qty: true
                    }
                }
            }
        })

        if(!cart){
            throw new NotFoundException('No cart exist !!');
        }
        return {
            cart
        };
    }

    async addProductToCart(user, productId: number){
        // Ensuring the product is present or not !! 
        const product = await this.prisma.product.findUnique({
            where: { id: productId}
        })

        if(!product){
            throw new NotFoundException('No such product exist !!')
        }

        // Checking the cart existing or not, if not exist creating one 
        let cart = await this.prisma.cart.findFirst({
            where: {
                userId: user.id,
                isDeleted: false
            }
        })
        if(!cart){
            cart = await this.prisma.cart.create({
                data: {
                    userId: user.id
                }
            })
        }

        // checking the product is present in the cartItem or not
        let isProductExist = await this.prisma.cartItems.findUnique({
            where: {
                cartId_productId: {
                    productId,
                    cartId: cart.id
                }
            }
        })

        let cartItem;
        if(isProductExist){
            cartItem = await this.prisma.cartItems.update({
                data:{
                    total_price: isProductExist.total_price + product.price,
                    total_qty: isProductExist.total_qty + 1
                },
                where: {
                    id: isProductExist.id
                },
                select: {
                    product: {
                        select: {
                            name: true,
                            price: true
                        }
                    },
                    total_qty: true,
                    total_price: true
                }
            })
        }else{
            cartItem = await this.prisma.cartItems.create({
                data: {
                    total_price: product.price,
                    total_qty: 1,
                    cartId: cart.id,
                    productId,
                    storeId: product.storeId
                },
                select: {
                    product: {
                        select: {
                            name: true,
                            price: true
                        }
                    },
                    total_qty: true,
                    total_price: true
                }
            })
        }
        return {
            message: "Product added to the cart successfully !!",
            product: cartItem,
            user: {
                name: user.userName,
                email: user.email
            }
        };
    }

    async updateQuantity(user, inc: 0 | 1, productId: number){
        
        // checking is there any cart present or not 
        const cart = await this.prisma.cart.findFirst({
            where: {
                userId: user.id,
                isDeleted: false
            }
        })
        if(!cart){
            throw new NotAcceptableException('There is no cart for this user !!');
        }

        // Checking the product is present in the cart or not  
        const cartItem = await this.prisma.cartItems.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId
                }
            },
            select: {
                id: true,
                total_price: true,
                total_qty: true,
                product: {
                    select: {
                        name: true,
                        price: true
                    }
                }
            }
        })

        if(!cartItem){
            throw new NotFoundException('No such product exist in the cart !!');
        }

        // If the quanity is 1 and still try to decrement the quantity then remove 
        // the item from the cart 
        if(cartItem.total_qty == 1 && inc == 0){
            const removedItem = await this.prisma.cartItems.delete({
                where: { id: cartItem.id}
            })
            return {
                message: "Item removed from the cart !!"
            }
        }
        const increaseQty = inc == 0 ? -1 : 1;

        const updatedData = await this.prisma.cartItems.update({
            data: {
                total_qty: cartItem.total_qty + increaseQty,
                total_price: cartItem.total_price + (increaseQty * cartItem.product.price)
            },
            where: {
                id: cartItem.id
            },
            select: {
                product: {
                    select: {
                        name: true,
                        price: true
                    }
                },
                total_price: true,
                total_qty: true
            }
        })

        return {
            message: "Product quanity updated successfully !!",
            updatedData
        }
    }

    async removeProduct(user, productId){
        // Checking is there any cart for this user
        const cart = await this.prisma.cart.findFirst({
            where: { 
                userId: user.id,
                isDeleted: false
            }
        })

        if(!cart){
            throw new NotFoundException("Cart doesn't exist !!");
        }

        // Checking is there any product in the cart with the given ID or not
        const cartItem = await this.prisma.cartItems.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId
                }
            }
        })

        if(!cartItem){
            throw new NotFoundException('There is no such product in the cart !!');
        }

        const removedProduct = await this.prisma.cartItems.delete({
            where: {
                id: cartItem.id
            }
        })
       
        return {
            message: "Item removed from the cart !!"
        }
    }
}