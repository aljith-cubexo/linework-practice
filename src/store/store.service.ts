import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateStoreDto } from "./Dto/create-store.dto";
import { UpdateStoreDto } from "./Dto/update-store.dto";


@Injectable()
export class StoreService {
    constructor( private readonly prisma: PrismaService){};

    async getStores(user) {
        const stores = await this.prisma.store.findMany({
            where: {
                userId: user.id,
                isDeleted: false
            },
            select: {
                id: true,
                name: true,
                location: true,
                user: {
                    select: {
                        userName: true,
                        email: true
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
        if(!stores[0]){
            return {
                message: 'No stores available'
            }
        }
        return {stores};
    }

    async createStore(user, createStoreDto: CreateStoreDto){
        const isStoreExist = await this.prisma.store.findFirst({
            where: {
                userId: user.id,
                name: createStoreDto.name
            }
        })

        if(isStoreExist){
            throw new ConflictException('A store with the same name already exist!!');
        }
        const category = await this.prisma.category.findFirst({
            where: {
                name: createStoreDto.category
            }
        })
        if(!category){
            throw new NotFoundException('No such category exist!!');
        }
        const { category: productCategory, ...data} = createStoreDto;
        const store = await this.prisma.store.create({
            data: {
                ...data,
                userId: user.id,
                categoryId: category.id
            },
            select: {
                name: true,
                location: true,
                user: {
                    select: {
                        userName: true,
                        email: true
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
        return {
            message: 'Store created Successfully !!',
            store
        }
    }

    async updateStore(user, storeId, updateStoreDto: UpdateStoreDto){
        const isStoreExist = await this.prisma.store.findUnique({
            where: { id: storeId}
        })

        if(!isStoreExist){
            throw new NotFoundException('No such store exist!!');
        }

        const { category } = updateStoreDto;
        if(category){
            const isCategoryExist = await this.prisma.category.findFirst({
                where: {
                    name: category
                }
            })
            
            if(!category){
                throw new NotFoundException('No such Category exist !!!');
            }
            updateStoreDto["categoryId"] = isCategoryExist.id;
        }
        const { category: storeCategory, ...data} = updateStoreDto;
        const store = await this.prisma.store.update({
            data: {
                ...data
            },
            where: {
                id: storeId
            },
            select: {
                name: true,
                location: true,
                user: {
                    select: {
                        userName: true,
                        email: true
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
        return {
            message: 'Store updated Successfully !!',
            store
        };
    }

    async deleteStore(storeId: number, user){
        const store = await this.prisma.store.findUnique({
            where: {
                id: storeId
            }
        })

        if(!store){
            throw new NotFoundException('No such store exist !!');
        }

        const deletedStore = await this.prisma.store.update({
            data: {
                isDeleted: true
            },
            where: {
                id: storeId
            },
            select: {
                name: true,
                location: true,
                user: {
                    select: {
                        userName: true,
                        email: true
                    }
                }
             }
        })
        
        return {
            message: 'Store deleted successfully !!',
            deletedStore
        }
    }

}