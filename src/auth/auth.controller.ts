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
import { UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    Log.info('ACTION: LOGIN FROM controller: ', signInDto);
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('signout')
  signout(@Body() token: string, @Request() req) {
    Log.info('ACTION: SIGN OUT FROM controller: ', token);
    this.authService.signOut(token);

    return { message: 'Sign-out successful' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: { token: string }) {
    Log.info('ACTION: REFRESH TOKEN', body);
    try {
      // Parse the token string which might be JSON
      const tokenData = JSON.parse(body.token);
      const token = tokenData.access_token;

      if (!token) {
        throw new UnauthorizedException('Invalid token format');
      }

      return this.authService.refreshToken(token);
    } catch (err) {
      Log.error('Token refresh error:', err);
      throw new UnauthorizedException('Invalid token format');
    }
  }
}
