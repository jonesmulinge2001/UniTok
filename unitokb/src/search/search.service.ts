/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class SearchService {
    constructor(){}
    private prisma = new PrismaClient();
    async searchAll(query: string) {
        if(!query) return [];
        const students = await this.prisma.profile.findMany({
            where: {
                name: { contains: query, mode: 'insensitive'},
            },
            take: 5,
        });

        const videos = await this.prisma.uniTokVideo.findMany({
            where: {
                description: { contains: query, mode: 'insensitive'},
            },
            take: 5,
        });

        return { students, videos }
    }
}
