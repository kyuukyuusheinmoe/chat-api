import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { PrismaService } from '../prisma.service';
import { AuthController } from './auth.controller';
import { PasswordService } from 'src/password.service';

@Module({
  imports: [JwtAuthModule],
  controllers: [AuthController],
  providers: [PrismaService, AuthService, PasswordService],
  exports: [AuthService],
})
export class AuthModule {}
