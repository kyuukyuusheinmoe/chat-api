/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Query, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/auth')
    list(): any {
        return this.authService.list();
    }

  @Get('/auth/login/google')
  async gg_login(@Query('code') code: string,) {
    const result = await this.authService.gg_login(code);
    
    if (result.status !== 201) {
      throw new HttpException(result.message, result.status);
    }

    return {
      statusCode: result.status,
      message: result.message,
      data: result.data,
      token: result.token
    };
  }
}

