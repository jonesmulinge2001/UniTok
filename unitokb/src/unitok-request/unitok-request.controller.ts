/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateRequestDto } from 'src/dto/unitok-request';
import { UpdateRequestDto } from 'src/dto/update-request.dto';
import { UniTokRequestService } from './unitok-request.service';
import { RequestWithUser } from 'src/interfaces/request-with-user';
import { AuthGuard } from '@nestjs/passport';
import { RequirePermissions } from 'src/decorator/permissions.decorator';
import { Permission } from 'src/permissions/permission.enum';

@UseGuards(AuthGuard('jwt'))
@RequirePermissions(Permission.CREATE_POST)
@Controller('unitok-requests')
export class UniTokRequestController {
  constructor(private readonly requestService: UniTokRequestService) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreateRequestDto) {
    const userId = req.user.id;
    return this.requestService.create(userId, dto);
  }

  @Get()
  findAll() {
    return this.requestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRequestDto) {
    return this.requestService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestService.remove(id);
  }
}
