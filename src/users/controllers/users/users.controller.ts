import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from 'src/users/services/users/users.service';
import { CreateUserType } from 'src/utils/types';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

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
  createUser(@Body() userData: CreateUserType) {
    console.log(userData);
    return this.usersService.createPost(userData);
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
    const existingUser = await this.usersService.updatePost(id, updatedUser);
    return updatedUser;
  }
}
