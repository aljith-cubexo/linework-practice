import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './Dto/signup-dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './Dto/signin-dto';
import { RoleType } from '@prisma/client';

interface ITokenPayload {
    id: number;
    role: RoleType;
}

@Injectable()
export class AuthService {
    constructor( 
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ){};

    async signupUser(userData: SignupDto){
        return this.createUser(userData, RoleType.USER);
    }

    async signupSeller(sellerData: SignupDto ){
        return this.createUser(sellerData, RoleType.SELLER)
    }

    async signupAdmin(adminData: SignupDto){
        return this.createUser(adminData, RoleType.ADMIN);
    }

    async signinUser({email, password}: SigninDto){
        
        const user = await this.prisma.user.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                password: true,
                roles: true
            }
        })

        if(!user){
            throw new NotFoundException("User with this email doesn't exist");
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if(!isCorrectPassword){
            throw new UnauthorizedException('Incorrect password');
        }

        const token = await this.generateToken({ 
            id: user.id,
            role: user.roles.role
        });

        return { token }
    }

    private generateToken(payload: ITokenPayload){
        return this.jwtService.signAsync(payload);
    }

    private async createUser (userData, roleType: RoleType) {
              
        const { userName, email, password} = userData;

        //  Checking the user credentials are already present or not !! 
        const isUserEmailExist = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if(isUserEmailExist){
            throw new ConflictException('User with this email already exist !');
        }

        const isUserNameExist = await this.prisma.user.findUnique({
            where: {
                userName
            }
        })

        if(isUserNameExist){
            throw new ConflictException('User with this username already exist !')
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Transaction code 
        const transaction = await this.prisma.$transaction(async (prisma) => {
            // Creating the user with the given credentials 
            const user = await prisma.user.create({
                data: {
                    ...userData,
                    password: hashedPassword
                }
            });

            // Creating the role for the user 
            const role = await prisma.role.create({
                data: {
                    role: roleType,
                    userId: user.id
                }
            })
        })

        return {
            message: `${roleType} signedup successfully !`
        }
    }
}
