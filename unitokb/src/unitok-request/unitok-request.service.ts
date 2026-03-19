/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import { CreateRequestDto } from 'src/dto/unitok-request';
import { UpdateRequestDto } from 'src/dto/update-request.dto';

@Injectable()
export class UniTokRequestService {
  constructor() {}
  private prisma = new PrismaClient();

  async create(userId: string, dto: CreateRequestDto) {
    return this.prisma.uniTokRequest.create({
      data: {
        title: dto.title,
        details: dto.details,
        targetInstitution: dto.targetInstitution,
        requesterId: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.uniTokRequest.findMany({
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const request = await this.prisma.uniTokRequest.findUnique({
      where: { id },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            institution: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return request;
  }

  async update(id: string, dto: UpdateRequestDto) {
    return this.prisma.uniTokRequest.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.uniTokRequest.delete({
      where: { id },
    });
  }
}