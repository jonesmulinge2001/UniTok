/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VideoLikeService } from './video-like.service';
import { AuthGuard } from '@nestjs/passport';
import { RequirePermissions } from 'src/decorator/permissions.decorator';
import { RequestWithUser } from 'src/interfaces/request-with-user';
import { Permission } from 'src/permissions/permission.enum';

@UseGuards(AuthGuard('jwt'))
@RequirePermissions(Permission.CREATE_POST)
@Controller('video-like')
export class VideoLikeController {
  constructor(private readonly videoLikeService: VideoLikeService) {}

  // LIKE
  @Post(':videoId')
  likeVideo(
    @Param('videoId', ParseUUIDPipe) videoId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.videoLikeService.likeVideo(videoId, req.user.id);
  }

  // UNLIKE
  @Delete(':videoId')
  unlikeVideo(
    @Param('videoId', ParseUUIDPipe) videoId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.videoLikeService.unlikeVideo(videoId, req.user.id);
  }

  // CHECK IF USER LIKED
  @Get(':videoId/status')
  likeStatus(
    @Param('videoId', ParseUUIDPipe) videoId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.videoLikeService.hasUserLiked(videoId, req.user.id);
  }
}
