import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async getUsers(
    user: UserDto,
    searchString: string,
    take?: number,
    skip?: number,
  ): Promise<{ status: number; data: any[] }> {
    try {
      const conditionOR = searchString
        ? {
            OR: [
              { email: { contains: searchString } },
              { name: { contains: searchString } },
            ],
          }
        : {};
      const users = await this.prismaService.user.findMany({
        where: {
          ...conditionOR,
          NOT: {
            email: user.email,
          },
        },
        take: Number(take) || undefined,
        skip: Number(skip) || undefined,
      });
      console.log('xxx list out user ');

      return { status: 200, data: users };
    } catch (error) {
      console.log('xxx error  ', error);
    }
  }

  async addFriend(user: UserDto, friendId: number) {
    try {
      const updatedUser = await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          friendList: {
            connect: { id: friendId },
          },
        },
        include: {
          friendList: true,
        },
      });
      return { status: 200, data: updatedUser };
    } catch (error) {
      console.log('Error adding friend:', error);
    }
  }
}
