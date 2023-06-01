import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { MailService } from '@sendgrid/mail';
import { EmailService } from './email.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '24h'
      }
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    PrismaService, 
    EmailService,
    MailService
  ],
})
export class AuthModule {}
