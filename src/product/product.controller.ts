import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./product.service";
import { AuthGuard } from "src/guards/auth.guard";
import { RoleType } from "@prisma/client";
import { Roles } from "src/decorotors/roles-decorotor";
import { CreateProductDto } from "./Dto/create-product.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuid } from "uuid";
import { extname } from "path";

const fileConfig = {
    destination: './files/products',
    filename: (req, file, cb) => {
        const uniqueSuffix = uuid();
        const fileExtension = extname(file.originalname);
        const uniqueFileName = uniqueSuffix + fileExtension;
        cb(null, uniqueFileName);
    }
}

const galleryFileConfig = {
    destination: './files/productsGallery',
    filename: (req, file, cb) => {
        const uniqueSuffix = uuid();
        const fileExtension = extname(file.originalname);
        const uniqueFileName = uniqueSuffix + fileExtension;
        cb(null, uniqueFileName);
    }
}


@Controller('product')
@Roles(RoleType.SELLER, RoleType.ADMIN)
@UseGuards(AuthGuard)
export class ProductController {
    constructor(private readonly productService: ProductService){};

    @Get('/:storeId')
    public async getProducts(
        @Req() { user },
        @Param('storeId', ParseIntPipe) storeId: number
    ){
        return this.productService.getProducts(user, storeId);
    }

    @Post('create/:storeId')
    public async createProduct(
        @Body() createProductDto: CreateProductDto,
        @Param('storeId', ParseIntPipe) storeId: number,
        @Req() { user }
    ){
        return this.productService.createProduct(createProductDto, storeId, user);
    }

    @Post('upload-image/:productId')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage(fileConfig)
        })
    )
    public async uploadProductImage(
        @UploadedFile('file') file: Express.Multer.File,
        @Req() { user },
        @Param('productId', ParseIntPipe) productId: number
    ){
        return this.productService.uploadProductImage(file, user, productId);
    }

    @Post('upload-gallery-image/:productId')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage(galleryFileConfig)
        })
    )
    public async uploadGalleryImage(
        @UploadedFile('file') file: Express.Multer.File,
        @Req() { user },
        @Param('productId', ParseIntPipe) productId: number,
        @Body() data
    ){
        return this.productService.uploadGalleryImage(file, user, productId, data);
    }

}