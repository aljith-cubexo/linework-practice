import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupUserDto } from './Dto/signup-user.dto';
import { SigninUserDto } from './Dto/signin-user-dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){};

    @Post('signup')
    signupUser(
        @Body() singupUserDto: SignupUserDto
    ){
        return this.authService.signupUser(singupUserDto)
    }

    @Post('signin')
    signinUser(
        @Body() signinUserDto: SigninUserDto
    ){
        return this.authService.signinUser(signinUserDto);
    }
}
