import { AccountType } from "@prisma/client";
import { IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsNumberString, IsOptional, IsString, Length, MaxLength, MinLength } from "class-validator";


export class SignupDto {
    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(15)
    password: string;

}