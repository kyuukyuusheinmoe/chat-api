import {
  Controller,
  Get,
  Post,
  Body,
  UnauthorizedException,
  Req,
  HttpException,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupDto } from './group.dto';
import { Request } from 'express';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async create(@Req() req: Request, @Body() groupData: GroupDto) {
    try {
      const user = req['user'];
      if (!user) {
        throw new UnauthorizedException('Authorization Failed');
      }

      const result = await this.groupService.create(user, groupData);

      if (result.status !== 201) {
        throw new HttpException('Error creating group Data', result.status);
      }

      return {
        statusCode: result.status,
        data: result.data,
      };
    } catch (error) {
      throw new HttpException('Authorization Failed', 401);
    }
  }

  @Get()
  async findAll() {
    try {
      const result = await this.groupService.findAll();

      if (result.status !== 200) {
        throw new HttpException('Error fetching Data', result.status);
      }

      return {
        statusCode: result.status,
        data: result.data,
      };
    } catch (error) {
      throw new HttpException('Error fetching Data', 500);
    }
  }
}
