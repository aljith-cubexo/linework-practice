import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfileDto } from './Dto/create-profile.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService){};

    private getPath(){
        let path: string[] | string = __dirname.split('/');
        path.pop();
        path.pop();
        path.push('files');
        path.push('profile');
        path = path.join('/');
        return path;
    }

    async updateProfile(profileData: CreateProfileDto, user: User){
        const profile = await this.prisma.profile.findUnique({
            where: {
                userId: user.id
            }
        })

        let response;
        if(!profile){
            response = await this.prisma.profile.create({
                data: {
                    ...profileData,
                    userId: user.id
                },
                select: {
                    firstName : true,           
                    lastName  : true,           
                    address   : true,           
                    city      : true,           
                    brief     : true,           
                    state     : true,           
                    country   : true,           
                    zipCode   : true,           
                    user: {
                        select: {
                            userName: true,
                            email: true,
                            roles: {
                                select: {
                                    role: true
                                }
                            }
                        }
                    }
                }
            })
        }else{
            response = await this.prisma.profile.update({
                data: {
                    ...profileData
                },
                where: {
                    id: profile.id
                },
                select: {
                    firstName : true,           
                    lastName  : true,           
                    address   : true,           
                    city      : true,           
                    brief     : true,           
                    state     : true,           
                    country   : true,           
                    zipCode   : true,           
                    user: {
                        select: {
                            userName: true,
                            email: true,
                            roles: {
                                select: {
                                    role: true
                                }
                            }
                        }
                    }
                }
            })
        }

        return response;
    }

    async getProfile(user: User){
        const profile = await this.prisma.profile.findUnique({
            where: {
                userId: user.id
            },
            select: {
                firstName : true,           
                lastName  : true,           
                address   : true,           
                city      : true,           
                brief     : true,           
                state     : true,           
                country   : true,           
                zipCode   : true, 
                avatarUrl: true,          
                user: {
                    select: {
                        userName: true,
                        email: true,
                        roles: {
                            select: {
                                role: true
                            }
                        }
                    }
                }
            }
        })

        return profile || "Don't have a profile !!";
    }

    async updateProfileImage(file, user){
        if(!file){
            throw new NotFoundException('No Image provided !!');
        }
        const profile = await this.prisma.profile.findUnique({
            where: {
                userId: user.id
            }
        })
        let response;
        if(!profile){
            response = await this.prisma.profile.create({
                data: {
                    avatarUrl: `${this.getPath()}/${file.filename}`,
                    userId: user.id
                },
                select: {
                    firstName : true,           
                    lastName  : true,           
                    address   : true,           
                    city      : true,           
                    brief     : true,           
                    state     : true,           
                    country   : true,           
                    zipCode   : true,   
                    avatarUrl: true,        
                    user: {
                        select: {
                            userName: true,
                            email: true
                        }
                    }
                }
            })
        }else{
            response = await this.prisma.profile.update({
                data: {
                    avatarUrl: `${this.getPath()}/${file.filename}`,
                },
                where: {
                    id: profile.id
                },
                select: {
                    firstName : true,           
                    lastName  : true,           
                    address   : true,           
                    city      : true,           
                    brief     : true,           
                    state     : true,           
                    country   : true,           
                    zipCode   : true,  
                    avatarUrl: true,            
                    user: {
                        select: {
                            userName: true,
                            email: true
                        }
                    }
                }
            })
        }
        return {
            message: "User profile added successfully !!",
            response
        }
    }
}
