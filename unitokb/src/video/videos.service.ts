/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type { Express } from 'express';

import { CreateUniTokVideoDto } from 'src/dto/create-unitok-video';
import { UpdateUniTokVideoDto } from 'src/dto/update-unitok-video';
import {
  UniTokCloudinaryService,
  UniTokUploadType,
} from 'src/shared/cloudinary/cloudinary/cloudinary.service';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class VideosService {
  constructor(private cloudinaryService: UniTokCloudinaryService) {}

  private prisma = new PrismaClient();

  // CREATE
  async createVideo(
    creatorId: string,
    data: CreateUniTokVideoDto & { videoUrl?: string },
    file?: Express.Multer.File,
  ) {
    let videoUrl = data.videoUrl;

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadMedia(
        file,
        UniTokUploadType.VIDEO,
      );
      videoUrl = uploadResult.secure_url;
    }

    if (!videoUrl) {
      throw new BadRequestException('No video URL provided');
    }

    const tagsArray = Array.isArray(data.tags)
      ? data.tags
      : typeof data.tags === 'string'
        ? JSON.parse(data.tags)
        : [];

    return this.prisma.uniTokVideo.create({
      data: {
        creatorId,
        title: data.title,
        description: data.description || '',
        videoUrl,
        tags: tagsArray,
      },
    });
  }

  // GET ALL
  async getAllVideos() {
    return this.prisma.uniTokVideo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // GET BY ID
  async getVideoById(id: string) {
    const video = await this.prisma.uniTokVideo.findUnique({
      where: { id },
    });
    if (!video) throw new NotFoundException('Video not found');
    return video;
  }

  // UPDATE
  async updateVideo(
    id: string,
    data: UpdateUniTokVideoDto,
    file?: Express.Multer.File,
  ) {
    const video = await this.prisma.uniTokVideo.findUnique({ where: { id } });
    if (!video) throw new NotFoundException('Video not found');

    // check ownership
    if (video.id !== id) {
      throw new BadRequestException('You can only edit your own video');
    }
    let videoUrl = video.videoUrl;
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadMedia(
        file,
        UniTokUploadType.VIDEO,
      );
      videoUrl = uploadResult.secure_url;
    }

    return this.prisma.uniTokVideo.update({
      where: { id },
      data: {
        ...data,
        videoUrl,
      },
    });
  }

  // DELETE
  async deleteVideo(id: string) {
    const video = await this.prisma.uniTokVideo.findUnique({ where: { id } });
    if (!video) throw new NotFoundException('Video not found');

    // check video ownership
    if (video.id !== id) {
      throw new BadRequestException('You can delete your own video');
    }

    return this.prisma.uniTokVideo.delete({ where: { id } });
  }


  // get video categories
  async getAllCategories(): Promise<string[]> {
    const videos = await this.prisma.uniTokVideo.findMany({
      select: {
        tags: true,
      },
    });
  
    // flatten tags array
    const allTags = videos.flatMap(video => video.tags);
  
    // remove duplicates
    const uniqueTags = [...new Set(allTags)];
  
    return uniqueTags.sort();
  }


  async getVideosByCategory(category: string) {
    return this.prisma.uniTokVideo.findMany({
      where: {
        tags: {
          has: category,
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
