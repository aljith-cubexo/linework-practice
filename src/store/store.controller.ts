import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { StoreService } from "./store.service";
import { AuthGuard } from "src/guards/auth.guard";
import { CreateStoreDto } from "./Dto/create-store.dto";
import { UpdateStoreDto } from "./Dto/update-store.dto";
import { Roles } from "src/decorotors/roles-decorotor";
import { RoleType } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { v4 as uuid } from "uuid";

const fileConfig = {
    destination: './files/store',
    filename: (req, file, cb) => {
        const uniqueSuffix = uuid();
        const fileExtension = extname(file.originalname);
        const uniqueFileName = uniqueSuffix + fileExtension;
        cb(null, uniqueFileName);
    }
}


@Controller('store')
@UseGuards(AuthGuard)
@Roles(RoleType.SELLER, RoleType.ADMIN)
export class StoreController {
    constructor(private readonly storeService: StoreService){};

    @Get()
    @Roles(RoleType.SELLER, RoleType.ADMIN)
    public async getStore(
        @Req() { user }
    ){
        return this.storeService.getStores(user);
    }

    @Post('create')
    public async createStore(
        @Req() { user },
        @Body() createStoreDto: CreateStoreDto
    ){
        return this.storeService.createStore(user, createStoreDto);
    }

    @Put('update/:id')
    public async updateStore(
        @Req() { user },
        @Body() updateStoreDto: UpdateStoreDto,
        @Param('id', ParseIntPipe) id: number
    ){
        return  this.storeService.updateStore(user, id, updateStoreDto);
    }

    @Delete('delete/:id')
    public async deleteStore(
        @Req() { user },
        @Param('id', ParseIntPipe) id: number
    ){
        return  this.storeService.deleteStore(id, user);
    } 

    @Post('upload-image/:storeId')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage(fileConfig)
        })
    )
    public async uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @Req() { user },
        @Param('storeId', ParseIntPipe) storeId: number
    ){
        return this.storeService.uploadImage(file, user, storeId);
    }
}