/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from './mailer/mailer.module';
import { UniTokCloudinaryService } from './shared/cloudinary/cloudinary/cloudinary.service';
import { CloudinaryModule } from './shared/cloudinary/cloudinary/cloudinary.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';

import { VideosController } from './video/videos.controller';
import { VideosService } from './video/videos.service';
import { VideosModule } from './video/videos.module';
import { VideoCommentModule } from './video-comment/video-comment.module';
import { VideoLikeModule } from './video-like/video-like.module';
import { InstitutionModule } from './institution/institution.module';
import { FollowModule } from './follow/follow.module';
import { UserManagementModule } from './admin/user-management/user-management.module';
import { VideoManagementModule } from './admin/video-management/video-management.module';
import { SearchModule } from './search/search.module';
import { UnitokRequestModule } from './unitok-request/unitok-request.module';

@Module({
  imports: [CloudinaryModule, MailerModule, PermissionsModule, AuthModule, ProfileModule, VideosModule, VideoCommentModule, VideoLikeModule, InstitutionModule, FollowModule, UserManagementModule, VideoManagementModule, SearchModule, UnitokRequestModule],
  controllers: [AppController, VideosController],
  providers: [AppService, UniTokCloudinaryService, VideosService],
})
export class AppModule {}
