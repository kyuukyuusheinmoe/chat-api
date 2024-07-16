import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtAuthModule],
  controllers: [AuthController],
  providers: [PrismaService, JwtService, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
