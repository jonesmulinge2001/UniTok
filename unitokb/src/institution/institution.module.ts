import { Module } from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { InstitutionController } from './institution.controller';
import { UniTokCloudinaryService } from 'src/shared/cloudinary/cloudinary/cloudinary.service';

@Module({
  providers: [InstitutionService, UniTokCloudinaryService],
  controllers: [InstitutionController],
})
export class InstitutionModule {}
