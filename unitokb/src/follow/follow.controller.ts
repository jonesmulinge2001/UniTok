/* eslint-disable prettier/prettier */
import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FollowService } from './follow.service';
import { RequirePermissions } from 'src/decorator/permissions.decorator';
import { Permission } from 'src/permissions/permission.enum';
import { RequestWithUser } from 'src/interfaces/request-with-user';

@Controller('follow')
@UseGuards(AuthGuard('jwt'))
export class FollowController {
    constructor( private readonly followService: FollowService){}

    @Post(':userId')
    @RequirePermissions(Permission.CREATE_PROFILE)
    async follow(@Param('userId') userId: string, @Req() req: RequestWithUser) {
        return this.followService.followUser(req.user.id, userId)
    }

    @Delete(':userId')
    @RequirePermissions(Permission.CREATE_PROFILE)
    async unFollow(@Param('userId') userId: string, @Req() req: RequestWithUser) {
        return this.followService.unfollowUser(req.user.id, userId);
    }

    @Get('followers/:userId')
    @RequirePermissions(Permission.CREATE_PROFILE)
    async getFollowers(@Param('userId') userId: string) {
        return this.followService.getFollowers(userId)
    }

    @Get('following/:userId')
    @RequirePermissions(Permission.CREATE_PROFILE)
    async getFollowing(@Param('userId') userId: string){
      return this.followService.getFollowing(userId);
    }

    @Get(':userId/stats')
    @RequirePermissions(Permission.CREATE_PROFILE)
    async getFollowStats(@Param('userId') userId: string) {
        const followers = await this.followService.getFollowersCount(userId);
        const following = await this.followService.getFollowingCount(userId);
        return { followers, following }
    }
}
