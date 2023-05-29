import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";



export class CreateProfileDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Expose()
    firstName: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Expose()
    lastName: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Expose()
    address: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Expose()
    city: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Expose()
    brief: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Expose()
    state: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Expose()
    country: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Expose()
    zipCode: string;

}