import { Module } from '@nestjs/common';
import { VideoManagementService } from './video-management.service';
import { VideoManagementController } from './video-management.controller';

@Module({
  providers: [VideoManagementService],
  controllers: [VideoManagementController]
})
export class VideoManagementModule {}
