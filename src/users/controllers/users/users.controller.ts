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
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/services/users/users.service';
import { CreateUserType } from 'src/utils/types';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/')
  getUsers() {
    return this.usersService.getPosts();
  }
  @Get('/:id')
  getUserById(@Param('id') id: string) {
    const user = this.usersService.findOne(id);
    if (!user) throw new NotFoundException('user not found');
    return user;
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
    console.log('Deleting user with id:', id);
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
