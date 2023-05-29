import { AccountType } from "@prisma/client";
import { IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength } from "class-validator";


export class SignupUserDto {
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

    @IsOptional()
    @Length(10, 10)
    phoneNumber: string;
}