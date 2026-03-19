/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideosService } from './videos.service';
import type { Express } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RequirePermissions } from 'src/decorator/permissions.decorator';
import { CreateUniTokVideoDto } from 'src/dto/create-unitok-video';
import { Permission } from 'src/permissions/permission.enum';
import { RequestWithUser } from 'src/interfaces/request-with-user';
import { UpdateUniTokVideoDto } from 'src/dto/update-unitok-video';
@UseGuards(AuthGuard('jwt'))
@RequirePermissions(Permission.CREATE_POST)
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  // CREATE
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createVideo(
    @Body() data: CreateUniTokVideoDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    return this.videosService.createVideo(req.user.id, data, file);
  }

  // GET ALL
  @Get()
  getAllVideos() {
    return this.videosService.getAllVideos();
  }

  
  @Get('categories')
  getCategories() {
    return this.videosService.getAllCategories();
  }

  @Get('category/:category')
getVideosByCategory(
  @Param('category') category: string,
) {
  return this.videosService.getVideosByCategory(category);
}

  // GET ONE
  @Get(':id')
  getVideoById(@Param('id', ParseUUIDPipe) id: string) {
    return this.videosService.getVideoById(id);
  }

  // UPDATE
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  updateVideo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUniTokVideoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.videosService.updateVideo(id, data, file);
  }

  // DELETE
  @Delete(':id')
  deleteVideo(@Param('id', ParseUUIDPipe) id: string) {
    return this.videosService.deleteVideo(id);
  }
}
