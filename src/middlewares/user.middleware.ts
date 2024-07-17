import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtAuthService } from 'src/jwt/jwt.servic';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly jwtAuthService: JwtAuthService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers['Authorization'] as string;
    const token = authorizationHeader.split(' ')[1];

    if (!authorizationHeader) {
      return next();
    }

    if (!token) {
      return next();
    }
    try {
      const user = this.jwtAuthService.verifyToken(token);
      req['user'] = user;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    next();
  }
}
