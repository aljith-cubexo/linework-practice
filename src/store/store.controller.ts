import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { StoreService } from "./store.service";
import { AuthGuard } from "src/guards/auth.guard";
import { CreateStoreDto } from "./Dto/create-store.dto";
import { UpdateStoreDto } from "./Dto/update-store.dto";


@Controller('store')
export class StoreController {
    constructor(private readonly storeService: StoreService){};

    @Get()
    @UseGuards(AuthGuard)
    getStore(
        @Req() { user }
    ){
        return this.storeService.getStores(user);
    }

    @Post('create')
    @UseGuards(AuthGuard)
    createStore(
        @Req() { user },
        @Body() createStoreDto: CreateStoreDto
    ){
        return this.storeService.createStore(user, createStoreDto);
    }

    @Put('update/:id')
    @UseGuards(AuthGuard)
    updateStore(
        @Req() { user },
        @Body() updateStoreDto: UpdateStoreDto,
        @Param('id', ParseIntPipe) id: number
    ){
        return  this.storeService.updateStore(user, id, updateStoreDto);
    }

    @Delete('delete/:id')
    @UseGuards(AuthGuard)
    deleteStore(
        @Req() { user },
        @Param('id', ParseIntPipe) id: number
    ){
        return  this.storeService.deleteStore(id, user);
    }
}