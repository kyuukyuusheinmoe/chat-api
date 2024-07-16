import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthService } from './jwt.servic';

@Module({
  imports: [
    JwtModule.register({
      secret: 'my-chat-api',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [JwtAuthService, JwtStrategy],
  exports: [JwtAuthService],
})
export class JwtAuthModule {}
