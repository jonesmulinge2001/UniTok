/* eslint-disable prettier/prettier */
import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { AuthGuard } from '@nestjs/passport';
import { RequirePermissions } from 'src/decorator/permissions.decorator';
import { Permission } from 'src/permissions/permission.enum';

@Controller('user-management')
export class UserManagementController {
  constructor(private readonly userService: UserManagementService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @RequirePermissions(Permission.MANAGE_USERS)
  async getUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @RequirePermissions(Permission.MANAGE_USERS)
  async getUser(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @RequirePermissions(Permission.MANAGE_USERS)
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  
}
