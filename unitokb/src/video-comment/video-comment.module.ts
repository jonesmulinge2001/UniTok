import { Module } from '@nestjs/common';
import { VideoCommentService } from './video-comment.service';
import { VideoCommentController } from './video-comment.controller';

@Module({
  providers: [VideoCommentService],
  controllers: [VideoCommentController]
})
export class VideoCommentModule {}
