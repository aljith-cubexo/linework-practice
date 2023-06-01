import { Controller, Delete, Get, NotAcceptableException, Param, ParseBoolPipe, ParseEnumPipe, ParseIntPipe, Query, Req, UseGuards } from "@nestjs/common";
import { CartService } from "./cart.service";
import { AuthGuard } from "src/guards/auth.guard";

enum IBoolean {
    true,
    false
}

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService){};

    @Get()
    public async getCart(
        @Req() { user }
    ){
        return this.cartService.getCart(user);
    }

    @Get('addproduct/:id')
    public async addProductToCart(
        @Req() { user },
        @Param('id', ParseIntPipe) productId: number
    ){
        return this.cartService.addProductToCart(user, productId);
    }

    @Get('update-qty/:id')
    public async updateQuntity(
        @Param('id', ParseIntPipe) productId: number,
        @Query('inc', new ParseIntPipe) inc: 1 | 0,
        @Req() { user }
    ){
        if(inc !== 0 && inc !== 1){
            throw new NotAcceptableException('Query is not acceptable !!');
        }
        
        return this.cartService.updateQuantity(user, inc, productId);
    }

    @Delete('remove/:id')
    public  async removeProduct(
        @Req() { user },
        @Param('id', ParseIntPipe) productId: number
    ){
        return this.cartService.removeProduct(user, productId);
    }
}