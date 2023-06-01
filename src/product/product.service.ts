import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductDto } from "./Dto/create-product.dto";


@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService){};

    private getPathToProducts(){
        let path: string[] | string = __dirname.split('/');
        path.pop();
        path.pop();
        path.push('files');
        path.push('products');
        path = path.join('/');
        return path;   
    }

    private getPathToProductsGallery(){
        let path: string[] | string = __dirname.split('/');
        path.pop();
        path.pop();
        path.push('files');
        path.push('productsGallery');
        path = path.join('/');
        return path;
    }

    async getAllProducts (){
        const products = await this.prisma.product.findMany({
            select: {
                id: true,
                name: true,
                image: true,
                gallery: true,
                price: true,
                currency: true,
                tax: true,
                shipping: true,
                brand: true,
                country: true,
                size: true,
                description: true,
                condition: true,
                note: true,
                total: true,
                sold: true,
                remained: true,
                category: {
                    select: {
                        name: true,
                        description: true
                    }
                }
            }
        })

        if(!products[0]){
            return {
                message: "No products available !!"
            }
        }

        return {
            products
        }
    }

    async getProducts (user, storeId: number){
        const products = await this.prisma.store.findUnique({
            where: { 
                id: storeId 
            },
            select: {
                Product: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        gallery: true,
                        price: true,
                        currency: true,
                        tax: true,
                        shipping: true,
                        brand: true,
                        country: true,
                        size: true,
                        description: true,
                        condition: true,
                        note: true,
                        total: true,
                        sold: true,
                        remained: true
                    }
                },
                Category: {
                    select: {
                        name: true,
                        description: true
                    }
                }
            }
        })
        if(!products){
            throw new NotFoundException("Store doesn't exist!!");
        }

        return {
            products
        }
    }

    async createProduct(createProductDto: CreateProductDto, storeId: number, user){
        const store = await this.prisma.store.findFirst({
            where: {
                id: storeId,
                userId: user.id
            }
        }) 

        if(!store){
            throw new NotFoundException('No such store exist !!');
        }


        const product = await this.prisma.product.create({
            data: {
                ...createProductDto,
                userId: user.id,
                storeId,
                categoryId: store.categoryId
            }
        })

        return {
            message: 'Product added to store Successfully !!'
        };
    }

    async uploadProductImage(file, user, productId){
        if(!file){
            throw new NotFoundException('No Image provided !!');
        }
        
        const isProductExist = await this.prisma.product.findFirst({
            where: {
                id: productId,
                userId: user.id
            }
        })

        if(!isProductExist){
            throw new NotFoundException('No such product exist !!');
        }

        const product = await this.prisma.product.update({
            data: {
                image: `${this.getPathToProducts()}/${file.filename}`
            },
            where: {
                id: productId
            }
        })

        return {
            message: 'Product image uploaded Successfully !!'
        }
    }

    async uploadGalleryImage(file, user, productId, data){
        if(!file){
            throw new NotFoundException('No Image provided !!');
        }
        if(!data.altText){
            throw new NotFoundException('No alt text provided !!')
        }
        
        const isProductExist = await this.prisma.product.findFirst({
            where: {
                id: productId,
                userId: user.id
            }
        })

        if(!isProductExist){
            throw new NotFoundException('No such product exist !!');
        }

        const productImage = await this.prisma.productImage.create({
            data: {
                url: `${this.getPathToProductsGallery()}/${file.filename}`,
                altText: data.altText,
                productId
            }
        })
        
        return {
            message: 'Gallery image uploaded Successfully !!'
        }
    }
}