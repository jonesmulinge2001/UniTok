import { Module } from '@nestjs/common';
import { VideoLikeService } from './video-like.service';
import { VideoLikeController } from './video-like.controller';

@Module({
  providers: [VideoLikeService],
  controllers: [VideoLikeController]
})
export class VideoLikeModule {}
