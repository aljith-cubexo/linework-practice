import { Currency } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    tax: number;

    @IsNotEmpty()
    @IsString()
    shipping: string;

    @IsNotEmpty()
    @IsString()
    brand: string;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    size: string;

    @IsNotEmpty()
    @IsEnum(Currency)
    currency: Currency;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    condition: string;

    @IsNotEmpty()
    @IsNumber()
    total: number;

    @IsNotEmpty()
    @IsNumber()
    sold: number;

    @IsNotEmpty()
    @IsNumber()
    remained: number;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    note?: string;
}