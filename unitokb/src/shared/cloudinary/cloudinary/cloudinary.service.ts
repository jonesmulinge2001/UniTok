/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

/**
 * Cloudinary Upload Response Extended
 */
export interface CloudinaryUploadResult extends UploadApiResponse {
  folder: string;
}

/**
 * Upload Types for UniTok Platform
 */
export enum UniTokUploadType {
  PROFILE_IMAGE = 'profile_image',
  VIDEO = 'video',
  VIDEO_THUMBNAIL = 'video_thumbnail',
  COMMENT_IMAGE = 'comment_image',
  REACTION_IMAGE = 'reaction_image',
}

/**
 * Upload Configuration Interface
 */
export interface UniTokUploadConfig {
  uploadType: UniTokUploadType;
  maxSizeBytes: number;
  allowedFormats: string[];
  folder: string;
  transformations?: any;
}

@Injectable()
export class UniTokCloudinaryService {
  private readonly logger = new Logger(UniTokCloudinaryService.name);

  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });

    this.logger.log('✅ UniTok Cloudinary service initialized successfully');
  }

  /**
   * Get upload configuration per UniTok upload type
   */
  private getUploadConfig(uploadType: UniTokUploadType): UniTokUploadConfig {
    const configs: Record<UniTokUploadType, UniTokUploadConfig> = {
      [UniTokUploadType.PROFILE_IMAGE]: {
        uploadType,
        maxSizeBytes: 2 * 1024 * 1024, // 2 MB
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        folder: 'unitok/users/profiles',
        transformations: {
          width: 400,
          height: 400,
          crop: 'fill',
          gravity: 'face',
          quality: 'auto',
          format: 'auto',
        },
      },
      [UniTokUploadType.VIDEO]: {
        uploadType,
        maxSizeBytes: 100 * 1024 * 1024, // 100 MB for short-form videos
        allowedFormats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
        folder: 'unitok/videos',
        transformations: {
          quality: 'auto',
          fetch_format: 'auto',
        },
      },
      [UniTokUploadType.VIDEO_THUMBNAIL]: {
        uploadType,
        maxSizeBytes: 3 * 1024 * 1024, // 3 MB
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        folder: 'unitok/videos/thumbnails',
        transformations: {
          width: 640,
          height: 360,
          crop: 'fill',
          quality: 'auto',
          format: 'auto',
        },
      },
      [UniTokUploadType.COMMENT_IMAGE]: {
        uploadType,
        maxSizeBytes: 2 * 1024 * 1024, // 2 MB
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        folder: 'unitok/comments/images',
        transformations: {
          width: 600,
          height: 600,
          crop: 'limit',
          quality: 'auto',
          format: 'auto',
        },
      },
      [UniTokUploadType.REACTION_IMAGE]: {
        uploadType,
        maxSizeBytes: 1 * 1024 * 1024, // 1 MB
        allowedFormats: ['png', 'webp', 'gif'],
        folder: 'unitok/reactions/icons',
        transformations: {
          width: 150,
          height: 150,
          crop: 'fit',
          quality: 'auto',
          format: 'auto',
        },
      },
    };

    return configs[uploadType];
  }

  /**
   * Upload image or video to Cloudinary
   */
  async uploadMedia(
    file: Express.Multer.File,
    uploadType: UniTokUploadType,
  ): Promise<CloudinaryUploadResult> {
    const config = this.getUploadConfig(uploadType);

    if (!file) throw new BadRequestException('No file provided');
    if (file.size > config.maxSizeBytes)
      throw new BadRequestException('File exceeds maximum allowed size');

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: config.folder,
          transformation: config.transformations,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error || !result) {
            return reject(
              new BadRequestException(
                'Cloudinary upload failed: ' +
                  (error?.message || 'Unknown error'),
              ),
            );
          }

          const uploadResult: CloudinaryUploadResult = {
            ...result,
            folder: config.folder,
          };
          resolve(uploadResult);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  /**
   * Upload non-media files (raw uploads)
   */
  async uploadRaw(
    file: Express.Multer.File,
    uploadType: UniTokUploadType,
  ): Promise<CloudinaryUploadResult> {
    const config = this.getUploadConfig(uploadType);

    if (!file) throw new BadRequestException('No file provided');
    if (file.size > config.maxSizeBytes)
      throw new BadRequestException('File exceeds maximum allowed size');

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: config.folder,
          resource_type: 'raw',
        },
        (error, result) => {
          if (error || !result) {
            return reject(
              new BadRequestException(
                'Cloudinary raw upload failed: ' +
                  (error?.message || 'Unknown error'),
              ),
            );
          }

          const uploadResult: CloudinaryUploadResult = {
            ...result,
            folder: config.folder,
          };
          resolve(uploadResult);
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}
