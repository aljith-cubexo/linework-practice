import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ){};

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request?.headers?.authorization?.split(' ').pop();
        
        if(!token){
            throw new UnauthorizedException('No token provided !');
        }
        
        return this.verifyToken(token, request);
    }

    private async verifyToken(token: string, request){

        try {
            const isValidToken = await this.jwtService.verifyAsync(token);
            
            const user = await this.prisma.user.findUnique({
                where: {
                    id: isValidToken.id
                }
            })
            if(!user){
                new UnauthorizedException('No such user exist!');
            }
            request.user = user;
            return true;
        } catch (err) {
            throw new UnauthorizedException(err.message)
        }
        
    }
}