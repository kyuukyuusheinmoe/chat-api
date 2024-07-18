import { Injectable, Param } from '@nestjs/common';
import { MessageDto } from './message.dto';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from 'src/auth/auth.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    user: UserDto,
    messageData: Omit<MessageDto, 'id' | 'senderId'>,
  ): Promise<{ status: number; message: string; data?: MessageDto }> {
    try {
      const message = await this.prismaService.message.create({
        data: { ...messageData, senderId: user.id },
      });
      return {
        status: 200,
        message: 'Message created Successfully',
        data: message,
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Error creating Message',
      };
    }
  }

  async findAll() {
    try {
      const messages = await this.prismaService.message.findMany({});
      return {
        status: 200,
        data: messages,
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Error fetching Messages',
      };
    }
  }

  async findByGroupId(groupId: number) {
    try {
      const messages = await this.prismaService.message.findMany({
        where: {
          groupId,
        },
      });
      return {
        status: 200,
        data: messages,
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Error creating Message',
      };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: MessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
