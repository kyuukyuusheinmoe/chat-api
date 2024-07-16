import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [AuthService],
  providers: [AuthService, PrismaService],
})
export class AppModule {}
