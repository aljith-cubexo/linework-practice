import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './Dto/signup-dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './Dto/signin-dto';
import { RoleType } from '@prisma/client';
import { EmailService } from './email.service';

interface ITokenPayload {
    id: number;
    role: RoleType;
}

@Injectable()
export class AuthService {
    constructor( 
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService
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

    async verifyEmail(token){

        const verifiedToken = await this.jwtService.verifyAsync(token);
        if(!verifiedToken){
            throw new UnauthorizedException('Invalid token');
        }

        // Checking the user is present or not !
        const user = await this.prisma.user.findUnique({
            where: { id: verifiedToken.id}
        })

        if(!user){
            throw new NotFoundException('No such user exist !!')
        }

        const updatedUser = await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                isEmailVerifiedAt: new Date()
            },
            select: {
                userName: true,
                email: true,
                isEmailVerifiedAt: true
            }
        })

        return updatedUser;
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

            return user;
        })

        const token = await this.jwtService.signAsync({ id: transaction.id});

        const mail = {
            to: email,
            subject: "Email Verification",
            from: process.env.SENDER,
            text: 'Email confirmation',
            html: `Press <a href="http://localhost:3000/auth/verify/${token}"> here </a> to 
                verify your email !`
        }

        const response =  await this.emailService.send(mail);
        // console.log(response);

        return {
            message: `${roleType} signedup successfully !`
        }
    }
}
