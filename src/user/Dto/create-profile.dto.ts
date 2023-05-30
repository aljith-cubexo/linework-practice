import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumberString, IsOptional, IsString, Length } from "class-validator";



export class CreateProfileDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    address: string;

    @IsOptional()
    @IsNumberString()
    @Length(10, 10)
    phoneNumber: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    city: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    brief: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    state: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    country: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    zipCode: string;

}