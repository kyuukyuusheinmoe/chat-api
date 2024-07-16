/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthService } from './jwt/jwt.servic';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ AuthModule],
  controllers: [AppController, AuthController],
  providers: [AppService, PrismaService, AuthService,JwtService, JwtAuthService],
})
export class AppModule {}
