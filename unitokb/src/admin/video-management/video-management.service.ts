/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, UniTokVideo } from 'generated/prisma/client';

@Injectable()
export class VideoManagementService {
    private prisma = new PrismaClient();

     // Fetch all posts with author info and counts
     async getAllVideos(): Promise<UniTokVideo[]> {
        try {
            const videos = await this.prisma.uniTokVideo.findMany({
                orderBy: { createdAt: 'desc'},
                include: {
                    creator: {
                        select: {
                            id: true,
                            name: true,
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
                        },
                    },
                    
                    _count: { select: {
                        likes: true,
                        comments: true,
                    }},
                }
            });
            if(!videos || videos.length === 0) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'No videos found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            return videos;
        } catch (error) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to fetch videos',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
     }

       // Fetch single post by id
       async getPostById(postId: string): Promise<UniTokVideo> {
        try {
          const post = await this.prisma.uniTokVideo.findUnique({
            where: { id: postId },
            include: {
              creator: {
                select: {
                  id: true,
                  name: true,
                  profile: {
                    select: {
                      profileImage: true,
                      institution: true,
                    },
                  },
                },
              },
              _count: { select: { likes: true, comments: true } },
            },
          });
    
          if (!post) {
            throw new HttpException(
              {
                statusCode: HttpStatus.NOT_FOUND,
                message: `Video with id ${postId} not found`,
              },
              HttpStatus.NOT_FOUND,
            );
          }
    
          return post;
        } catch (error) {
          throw new HttpException(
            {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: 'Failed to fetch video',
              error: error.message || error,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }


        // Hard delete (permanently remove)
  async deletePost(videoId: string): Promise<UniTokVideo> {
    try {
      const existingPost = await this.prisma.uniTokVideo.findUnique({
        where: { id: videoId },
      });
  
      if (!existingPost) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Post with id ${videoId} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }
  
      // Perform all deletes atomically (transaction)
      await this.prisma.$transaction([
        // // 1. Delete comment likes (or other children of comments)
        // this.prisma.uniTokComment.deleteMany({
        //   where: { content: { videoId } },
        // }),
  
        // 2. Delete comments
        this.prisma.uniTokComment.deleteMany({
          where: { videoId },
        }),
  
        // 3. Delete likes on the post
        this.prisma.uniTokVideoLike.deleteMany({
          where: { videoId },
        }),
      ]);
  
      // 6. Finally delete the post itself
      const deletedPost = await this.prisma.uniTokVideo.delete({
        where: { id: videoId },
      });
  
      return deletedPost;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to permanently delete post',
          error: error.message || error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
}
