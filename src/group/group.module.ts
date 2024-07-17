import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from '../users/user.service';

@Module({
  controllers: [GroupController],
  providers: [GroupService, PrismaService, UserService],
})
export class GroupModule {}
