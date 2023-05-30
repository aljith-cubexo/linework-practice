import { Body, Controller, Get, NotFoundException, Post, Req, SetMetadata, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateProfileDto } from './Dto/create-profile.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';

const fileConfig = {
    destination: './files/profile',
    filename: (req, file, cb) => {
        const uniqueSuffix = uuid();
        const fileExtension = extname(file.originalname);
        const uniqueFileName = uniqueSuffix + fileExtension;
        cb(null, uniqueFileName);
    }
}

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){};

    @Get('profile')
    getProfile(
        @Req() req
    ){
        
        return this.userService.getProfile(req.user);
    }

    @Post('profile')
    updateProfile(
        @Body() createProfileDto: CreateProfileDto, 
        @Req() req
    ){
        return this.userService.updateProfile(createProfileDto, req.user);
    }

    @Post('upload-profile')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage(fileConfig)
        })
    )
    updateProfileImage(
        @UploadedFile() file: Express.Multer.File,
        @Req() {user}
    ){
        return this.userService.updateProfileImage(file, user);
    }
}
