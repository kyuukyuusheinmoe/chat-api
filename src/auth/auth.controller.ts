/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Query, HttpException, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post("/auth/register")
  async register(@Body() userData: UserDto,) {
    const result = await this.authService.register(userData);
    
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

  @Post("/auth/login")
  async login(@Body() userData: UserDto,) {
    const result = await this.authService.login(userData);
    
    if (result.status !== 200) {
      throw new HttpException(result.message, result.status);
    }

    return {
      statusCode: result.status,
      message: result.message,
      token: result.token
    };
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

