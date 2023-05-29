import { Status } from "@prisma/client";
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

enum ICategory {
    MOBILE = 'mobile',
    LAPTOP = 'laptop'
}

export class UpdateStoreDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    location: string;

    @IsOptional()
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

    @IsOptional()
    @IsBoolean()
    isDeleted?: boolean;
}