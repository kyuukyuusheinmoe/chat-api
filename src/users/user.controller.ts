import {
  Controller,
  Get,
  HttpException,
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
  }
}
