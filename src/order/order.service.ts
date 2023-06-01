import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateStatusDto } from "./Dto/update-status.dto";
import { OrderStatus } from "@prisma/client";


@Injectable()
export class OrderService {
    constructor(private readonly prisma: PrismaService){};

    async getAllOrders(user){
        // Finding All orders of the user
        const orders = await this.prisma.order.findMany({
            where: {
                userId: user.id
            }
        })

        if(!orders[0]) {
            return {
                message: 'No orders yet !!'
            }
        }

        return {
            orders
        };
    }

    async createOrder(user){
        // Checking the cart is present or not
        let cart: any = await this.prisma.cart.findFirst({
            where: {
                userId: user.id,
                isDeleted: false
            },
            select: {
                id: true,
                CartItems: true
            }
        }) 

        if(!cart || !cart.CartItems[0]){
            throw new NotFoundException('No cart exist !!');
        }

        const transaction =  await this.prisma.$transaction(async (prisma) => {
            // Updating checkout property to true for all cartItems
            const updateCheckout = await prisma.cartItems.updateMany({
                where: {
                    cartId: cart.id
                },
                data: {
                    isCheckout: true
                }
            })

            // Finding distinct stores within the cart
            const totalStores = await prisma.cartItems.findMany({
                where: {
                    cartId: cart.id,
                },  
                include: {
                    product: {
                        select: {
                            tax: true
                        }
                    }
                }
            });

            // Calculating quantities, total items and tax etc ...
            let orderData = {};
            totalStores.forEach((item) => {
                if(orderData[item.storeId]){
                    let obj = orderData[item.storeId];
                    
                    orderData[item.storeId] = {
                        qty: (obj.qty + item.total_qty),
                        items: obj.items + 1,
                        storeId: item.storeId,
                        cartId: item.cartId,
                        totalAmount: (obj.totalAmount + item.total_price),
                        tax: obj.tax + (item.product.tax * item.total_qty)
                    }
                }else{
                    orderData[item.storeId] = {
                        qty: item.total_qty,
                        items: 1,
                        storeId: item.storeId,
                        cartId: item.cartId,
                        totalAmount: item.total_price,
                        tax: (item.product.tax * item.total_qty)
                    }
                }
            })

            // console.log(orderData);
            const orderDataKeys = Object.keys(orderData);

            // creating orders for all distinct stores and assigning that in to an array
            const allOrders = orderDataKeys.map((key) => {
                return (
                    this.prisma.order.create({
                        data: {
                            ...orderData[key],
                            userId: user.id,
                            discount: 100,
                            deliveryFee: 100,
                            deliveryTime: new Date(),
                            address: 'something',
                            paymentId: 1,
                            totalAmount: orderData[key].totalAmount + 100
                        }
                    })
                )
            })
            
            const response = await Promise.all(allOrders);

            // Deleting the cart of the user
            const removedCart = await this.prisma.cart.update({
                where: {
                    id: cart.id
                },
                data: {
                    isDeleted: true
                }
            })
            return {
                message: "Order created successfully !!"
            };
        })
        return transaction;
    }

    async updateStatus(user, updateStatusDto: UpdateStatusDto, orderId){
        // Checking is there any such order exist !!
        const order = await this.prisma.order.findUnique({
            where: { id: orderId}
        })

        if(!order){
            throw new NotFoundException('No such order exist !!');
        }

        const store = await this.prisma.store.findUnique({
            where: {
                id: order.storeId
            }
        })

        if(!store){
            throw new NotFoundException('No such store exist !!');
        }

        if(store.userId !== user.id){
            throw new UnauthorizedException('This Seller is not the owner of this store !!')
        }

        // Updating the order status 
        let updatedOrder;
        if(updateStatusDto.status === OrderStatus.UNFULFILLED){
            updatedOrder = await this.prisma.order.update({
                where: {
                    id: orderId
                },
                data: {
                    orderStatus: updateStatusDto.status,
                    RejectDesc: updateStatusDto.message
                }
            })
        }else if(updateStatusDto.status === OrderStatus.FULFILLED){
            updatedOrder = await this.prisma.order.update({
                where: {
                    id: orderId
                },
                data: {
                    orderStatus: updateStatusDto.status,
                    RejectDesc: ""
                }
            })
        }

        return updatedOrder;
    }

    // async deleteOrder(){
    //     // return await this.prisma.order.deleteMany();
    //     // return await this.prisma.cart.update({
    //     //     where: { id: 1},
    //     //     data: { isDeleted: false}
    //     // })
    // }
}