import { OrderStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsSemVer, IsString, IsUUID } from "class-validator";


export class UpdateStatusDto {
    @IsEnum(OrderStatus)
    @IsNotEmpty()
    status: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    message: string;
}