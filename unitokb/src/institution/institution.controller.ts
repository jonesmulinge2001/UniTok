/* eslint-disable prettier/prettier */

import {
    Body,
    Controller,
    Post,
    Get,
    ValidationPipe,
  } from '@nestjs/common';
  import { InstitutionService } from './institution.service';
import { CreateInstitutionRequestDto } from 'src/dto/create-institution';
  
  @Controller('institutions')
  export class InstitutionController {
    constructor(
      private readonly institutionService: InstitutionService,
    ) {}
  
    /** Register a new institution */
    @Post()
    async registerInstitution(
      @Body(new ValidationPipe({ transform: true }))
      body: CreateInstitutionRequestDto,
    ) {
      return this.institutionService.registerInstitution(body);
    }
  
    /** Fetch all institutions (for dropdowns) */
    @Get()
    async getAllInstitutions() {
      return this.institutionService.getAllInstitutions();
    }
  }
  