/* eslint-disable prettier/prettier */
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { UserMiddleware } from './middlewares/user.middleware';
import { JwtAuthService } from './jwt/jwt.servic';
import { JwtModule } from '@nestjs/jwt';
import { GroupModule } from './group/group.module';
import { ChatGateway } from './chat/chat.gateway';
import { MessageModule } from './message/message.module';

@Module({
  imports: [ AuthModule, UserModule, JwtModule.register({
    secret: 'my-chat-api',
    signOptions: { expiresIn: '1h' },
  }), GroupModule, MessageModule,],
  controllers: [AppController],
  providers: [AppService, JwtAuthService, ChatGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes('users', 'group', "users/add-friend", "message");
  }
}