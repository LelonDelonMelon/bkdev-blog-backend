import {
  Controller,
  HttpStatus,
  Post,
  HttpCode,
  Body,
  Param,
  Query,
  Request,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/posts/dto/signInDto';
import { AuthGuard } from './auth.guard';
import Log from 'src/log';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    Log.info('From controller: ', signInDto);
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('signout')
  signout(@Body() token: string, @Request() req) {
    this.authService.signOut(token);

    return { message: 'Sign-out successful' };
  }
}
