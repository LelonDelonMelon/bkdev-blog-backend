import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { TokenRevokeServiceService } from './token-revoke-service/token-revoke-service.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,

      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, TokenRevokeServiceService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
