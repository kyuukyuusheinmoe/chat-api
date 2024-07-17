import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(
    @Query('searchString') searchString?: string,
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ) {
    const result = await this.userService.getUsers(searchString, take, skip);

    if (result.status !== 200) {
      throw new HttpException('Error fetching Data', result.status);
    }

    return {
      statusCode: result.status,
      data: result.data,
    };
  }
}
