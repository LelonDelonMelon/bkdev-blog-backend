import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthService } from 'src/auth/auth.service';
import { TokenRevokeServiceService } from 'src/auth/token-revoke-service/token-revoke-service.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, TokenRevokeServiceService],
  exports: [UsersService],
})
export class UsersModule {}
