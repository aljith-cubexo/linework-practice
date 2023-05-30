import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { RoleType } from "@prisma/client";
import { Observable } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly reflector: Reflector
    ){};

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<RoleType[]>('roles', context.getHandler());
        const request = context.switchToHttp().getRequest();
        const token = request?.headers?.authorization?.split(' ').pop();
        
        if(!token){
            throw new UnauthorizedException('No token provided !');
        }
        
        return this.verifyToken(token, request, roles);
    }

    private async verifyToken(token: string, request, roles: RoleType[] | undefined){

        try {
            const isValidToken = await this.jwtService.verifyAsync(token);
            
            const user = await this.prisma.user.findUnique({
                where: {
                    id: isValidToken.id
                },
                select: {
                    id: true,
                    email: true,
                    userName: true,

                    roles: {
                        select: {
                            role: true
                        }
                    }
                }
            })

            if(!user){
                throw new UnauthorizedException('No such user exist!');
            }
            request.user = user;
            const role = user.roles.role;
            
            if(!roles) return true;
            
            return this.matchRoles(roles, role);

        } catch (err) {
            throw new UnauthorizedException(err.message)
        }
        
    }

    private matchRoles(roles: RoleType[], role: RoleType){
      
        return roles.includes(role);
    }
}