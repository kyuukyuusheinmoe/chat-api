import {
  Body,
  Controller,
  Get,
  HttpException,
  Patch,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(
    @Req() req: Request,
    @Query('searchString') searchString?: string,
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ) {
    try {
      const user = req['user'];
      if (!user) {
        throw new UnauthorizedException('Authorization Failed');
      }

      const result = await this.userService.getUsers(
        user,
        searchString,
        take,
        skip,
      );

      if (result.status !== 200) {
        throw new HttpException('Error fetching Data', result.status);
      }

      return {
        statusCode: result.status,
        data: result.data,
      };
    } catch (error) {
      throw new HttpException('Authorization Failed', 401);
    }
  }

  @Patch('add-friend')
  async addFriend(@Req() req: Request, @Body() friendId: number) {
    try {
      const user = req['user'];
      if (!user) {
        throw new UnauthorizedException('Authorization Failed');
      }

      if (isNaN(user.id) || isNaN(friendId)) {
        throw new HttpException('Invalid userId or friendId', 400);
      }

      const result = await this.userService.addFriend(user, friendId);

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
}
