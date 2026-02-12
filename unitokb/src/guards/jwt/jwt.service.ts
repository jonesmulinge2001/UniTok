/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'generated/prisma';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor(private configService: ConfigService) {
    this.secret = configService.get<string>('JWT_SECRET') || 'default-secret';
    this.expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '24h';
  }

  generateToken(payload: JwtPayload): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return jwt.sign(payload as any, this.secret, { expiresIn: this.expiresIn } as any);
  }

  verifyToken(token: string): JwtPayload {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
      return jwt.verify(token, this.secret) as any;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
      return jwt.decode(token) as any;
    } catch {
      return null;
    }
  }

  extractTokenFromHeader(authHeader: string): string {
    if(!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthorizedException('Missing or Invalid token');
    }
    return authHeader.substring(7);
  }
}
