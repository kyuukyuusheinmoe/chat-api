/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) {}
    register(): string {
        return 'Hello World!';
}
  login(): string {
    return 'Hello World!';
  }
}
