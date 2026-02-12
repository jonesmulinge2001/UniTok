/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from 'src/mailer/mailer.service';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [
    PermissionsModule,
    MailerModule,
    ConfigModule.forRoot({ isGlobal: true}),
    JwtModule.register({
      secret: process.env.JWT_SCRET || 'defaultSecret',
      signOptions: { expiresIn: '1d'},
    }),
  ],
  providers: [AuthService, MailerService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtModule]
})
export class AuthModule {}
