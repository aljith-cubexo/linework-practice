import { Status } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

enum ICategory {
    MOBILE = 'mobile',
    LAPTOP = 'laptop'
}

export class CreateStoreDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    location: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(ICategory)
    category: string;

    @IsOptional()
    @IsEnum(Status)
    status: Status;

    @IsOptional()
    @IsString()
    description?:string;

    @IsOptional()
    @IsInt()
    start_time_close?: number;

    @IsOptional()
    @IsInt()
    end_time_close?: number;
}