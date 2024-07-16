import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { PrismaService } from '../prisma.service';
import { JwtAuthService } from 'src/jwt/jwt.servic';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtAuthModule],
  controllers: [AuthController],
  providers: [PrismaService, JwtAuthService, JwtService, AuthService],
})
export class AuthModule {}
