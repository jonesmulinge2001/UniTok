/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class UserManagementService {
  private prisma = new PrismaClient();

  constructor() {}

  // Get all users (with stats)
  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        profile: {
          select: {
            profileImage: true,
            institution: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        videos: {
          select: {
            id: true,
          },
        },
      },
    });

    return users.map((user) => ({
      ...user,
      totalVideos: user.videos.length,
    }));
  }

  // Get user by ID
  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        profile: {
          select: {
            profileImage: true,
            institution: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        videos: {
          select: {
            id: true,
          },
        },
      },
    });
    if(!user) {
        throw new NotFoundException('User not found');
    }
    return {
        ...user,
        totalVideos: user.videos.length,
    };
  }

    //  Delete user
    async deleteUser(id: string) {
        const userExists = await this.prisma.user.findUnique({
            where: { id }
        });
        if(!userExists) throw new NotFoundException('User not found');
        await this.prisma.user.delete({ where: { id }});
        return { message: 'User deleted successfully'};
    }
}
