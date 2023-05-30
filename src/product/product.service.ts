import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductDto } from "./Dto/create-product.dto";


@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService){};

    private getPath(){
        let path: string[] | string = __dirname.split('/');
        path.pop();
        path.pop();
        path.push('files');
        path.push('products');
        path = path.join('/');
        return path;
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
                image: `${this.getPath()}/${file.filename}`
            },
            where: {
                id: productId
            }
        })

        return {
            message: 'Product image uploaded Successfully !!'
        }
    }
}