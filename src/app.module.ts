import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StoreModule } from './store/store.module';
import { ProductModule } from './product/product.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    UserModule, 
    StoreModule,
    ProductModule,
    CartModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ]
})
export class AppModule {}
