import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary/cloudinary.module';
import { UniTokCloudinaryService } from 'src/shared/cloudinary/cloudinary/cloudinary.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { PermissionGuard } from 'src/guards/permissions.guard';

@Module({
  imports: [CloudinaryModule],
  providers: [
    ProfileService,
    UniTokCloudinaryService,
    PermissionsService,
    PermissionGuard,
  ],
  controllers: [ProfileController],
})
export class ProfileModule {}
