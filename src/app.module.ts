/* eslint-disable prettier/prettier */
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { UserMiddleware } from './middlewares/user.middleware';
import { JwtAuthService } from './jwt/jwt.servic';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ AuthModule, UserModule, JwtModule.register({
    secret: 'my-chat-api',
    signOptions: { expiresIn: '1h' },
  }),],
  controllers: [AppController],
  providers: [AppService, JwtAuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes('users');
  }
}