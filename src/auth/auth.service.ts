import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupUserDto } from './Dto/signup-user.dto';
import * as bcrypt from 'bcryptjs';
import { SigninUserDto } from './Dto/signin-user-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor( 
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ){};

    async signupUser(userData: SignupUserDto){

        const { email, password} = userData;

        const isUserExist = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if(isUserExist){
            throw new ConflictException('User with this credentials already exist !');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword
            }
        })

        return {
            message: 'User signedup successfully !'
        }
    }

    async signinUser({email, password}: SigninUserDto){
        
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if(!user){
            throw new NotFoundException("User with this email doesn't exist");
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if(!isCorrectPassword){
            throw new UnauthorizedException('Incorrect password');
        }

        const token = await this.generateToken({ id: user.id });
        return { token }
    }

    private generateToken(payload: { id: number}){
        return this.jwtService.signAsync(payload);
    }
}
