import { Injectable, Query } from '@nestjs/common';
import { UserDto } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async getUsers(
    @Query('searchString') searchString?: string,
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ): Promise<{ status: number; data: any[] }> {
    console.log('xxx searchString ', searchString);
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
        where: { ...conditionOR },
        take: Number(take) || undefined,
        skip: Number(skip) || undefined,
      });
      console.log('xxx list out user ');

      return { status: 200, data: users };
    } catch (error) {
      console.log('xxx error  ', error);
    }
  }
}
