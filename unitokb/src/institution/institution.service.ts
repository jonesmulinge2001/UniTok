/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import {
    Injectable,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { PrismaClient } from 'generated/prisma/client';


 

  import { CreateInstitutionRequestDto } from 'src/dto/create-institution';
  
  @Injectable()
  export class InstitutionService {
    private prisma = new PrismaClient();
    
  
    /** Create a new institution */
    async registerInstitution(dto: CreateInstitutionRequestDto) {
      try {
        const institution = await this.prisma.institution.create({
          data: {
            name: dto.name,
          },
        });
  
        return institution;
      } catch (error) {
        throw new InternalServerErrorException(
          'Failed to create institution.',
        );
      }
    }
  
    /** Get all institutions for dropdowns */
    async getAllInstitutions() {
      try {
        return await this.prisma.institution.findMany({
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            name: 'asc',
          },
        });
      } catch (error) {
        console.error('Error fetching institutions:', error);
        throw new InternalServerErrorException(
          'Unable to retrieve institutions at this time.',
        );
      }
    }
  }
  