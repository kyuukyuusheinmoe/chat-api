/* eslint-disable prettier/prettier */
import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/auth')
    list(): any {
        return this.authService.list();
    }

  @Post('register')
  register(): string {
    return this.authService.register();
  }
}
