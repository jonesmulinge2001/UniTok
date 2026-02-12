/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UniTokCloudinaryService } from './cloudinary.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
  ],
  providers: [UniTokCloudinaryService],
  exports: [UniTokCloudinaryService],
})
export class CloudinaryModule {}
