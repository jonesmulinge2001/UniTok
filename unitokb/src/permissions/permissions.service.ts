/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Permission } from './permission.enum';
import { UserRole } from 'generated/prisma/client';


@Injectable()
export class PermissionsService {
  private readonly reloPermissions: Record<UserRole, Permission[]> = {
    ADMIN: [
      Permission.VIEW_ANALYTICS,
      Permission.MANAGE_USERS,
      Permission.MANAGE_PROFILE,
      Permission.MANAGE_USERS,
      Permission.VIEW_USERS,
      Permission.VIEW_COMMENT,
    ],
    STUDENT: [
        Permission.CREATE_POST,
        Permission.CREATE_COMMENT,
        Permission.DELETE_POST,
        Permission.MANAGE_PROFILE,
        Permission.VIEW_POSTS,
        Permission.DELETE_COMMENT,
        Permission.LIKE_POST,
    ]
  };

  getRolePermissions(role: UserRole): Permission[] {
    return this.reloPermissions[role] || [];
  }
  hasPermission(role: UserRole, permission: Permission): boolean {
    return this.getRolePermissions(role).includes(permission)
  }

}
