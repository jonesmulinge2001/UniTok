import { Module } from '@nestjs/common';
import { UniTokRequestService } from './unitok-request.service';
import { UniTokRequestController } from './unitok-request.controller';

@Module({
  providers: [UniTokRequestService],
  controllers: [UniTokRequestController],
})
export class UnitokRequestModule {}
