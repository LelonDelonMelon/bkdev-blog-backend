import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { Req } from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/services/users/users.service';
import { CreateUserType } from 'src/utils/types';
import Log from 'src/log';
import { access } from 'fs';
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) { }

  @Get('/')
  getUsers() {
    return this.usersService.getPosts();
  }
  @Get('/:id([0-9]+)')
  getUserById(@Param('id') id: string) {
    const user = this.usersService.findOne(id);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }
  @Get('/me')
  async getUserDetails(@Req() req: Request) {
    const authHeader = req.headers['authorization'];

    Log.info('Auth Header @me', authHeader);
    if (!authHeader) {
      Log.error('No authorization header provided @me');
      throw new UnauthorizedException('No authorization header provided');
    }

    try {
      // Remove 'Bearer ' prefix if it exists
      const jsonStr = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)  // Remove 'Bearer ' prefix
        : authHeader;

      // Parse the JSON string to get the access_token
      const authData = JSON.parse(jsonStr);
      const token = authData.access_token;

      if (!token) {
        Log.error('No access token found in auth header');
        throw new UnauthorizedException('Invalid token format');
      }

      Log.info('Extracted token @me', token.split(":")[1].split('"')[1]);

      const decoded = await this.authService.verifyToken(token.split(":")[1].split('"')[1]);
      const userId = decoded.sub;
      Log.info('User ID @me', userId);
      const user = await this.usersService.findOne({ _id: userId });
      Log.info('User @me', user);
      return user;
    } catch (err) {
      Log.error('Token verification error:', err);

      // Check if token is expired
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          message: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      }

      // Handle other token errors
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException({
          message: 'Invalid token',
          code: 'INVALID_TOKEN'
        });
      }

      throw new UnauthorizedException('Authentication failed');
    }
  }
  @Post('/new')
  async createUser(@Body() userData: CreateUserType) {
    const existingUser = await this.usersService.findOne({
      email: userData.email,
    });

    if (existingUser) {
      throw new ConflictException('User with the same email already exists!');
    }
    return await this.authService.signUp(userData.email, userData.password);
  }
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    Log.info('Deleting user with id:', id);
    return this.usersService.deleteOne(id);
  }
  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updatedUser: CreateUserType,
  ) {
    const existingUser = await this.usersService.updateUser(id, updatedUser);
    return updatedUser;
  }
}
