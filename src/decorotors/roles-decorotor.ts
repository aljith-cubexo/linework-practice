import { SetMetadata } from "@nestjs/common";
import { RoleType } from "@prisma/client";

export const Roles = (...roles: RoleType[]) => {
    return SetMetadata('roles', roles);
}