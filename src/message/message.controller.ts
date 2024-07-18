import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageDto } from './message.dto';
import { Request } from 'express';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Req() req: Request, @Body() messageData: MessageDto) {
    try {
      const user = req['user'];
      if (!user) {
        throw new UnauthorizedException('Authorization Failed');
      }

      if (isNaN(messageData.senderId) && isNaN(messageData.groupId)) {
        throw new HttpException('Invalid userId or friendId', 400);
      }

      const result = await this.messageService.create(user, messageData);

      if (result.status !== 200) {
        throw new HttpException('Error adding friend', result.status);
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
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':groupId')
  findByGroupId(@Param('groupId') groupId: string) {
    return this.messageService.findByGroupId(+groupId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: MessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
