import { Body, Controller, Get, Param, ParseEnumPipe, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './Dto/signup-dto';
import { SigninDto } from './Dto/signin-dto';

enum Role {
    USER='user',
    SELLER='seller',
    ADMIN='admin'
}

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){};

    @Post('signup/:usertype')
    public async signupUser(
        @Body() singupDto: SignupDto,
        @Param('usertype', new ParseEnumPipe(Role)) userType: Role
    ){
        switch (userType) {
            case 'user':
                return this.authService.signupUser(singupDto);
            case 'seller':
                return this.authService.signupSeller(singupDto);
            case 'admin': 
                return this.authService.signupAdmin(singupDto);
        }
    }

    @Post('signin')
    public async signinUser(
        @Body() signinUserDto: SigninDto 
    ){
        return this.authService.signinUser(signinUserDto);
    }

    @Get('verify/:token')
    public async verifyEmail(
        @Param('token') token: string
    ){
        return this.authService.verifyEmail(token);
    }
}
