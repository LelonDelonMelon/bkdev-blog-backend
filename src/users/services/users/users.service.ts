import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserType } from 'src/utils/types';
import { InjectModel } from '@nestjs/mongoose';

let allData = [];
@Injectable()
export class UsersService {
  mockData = [{ email: 'deneme@123gmail.com', password: 'deneme123' }];

  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    allData.push(this.getPosts());
  }
  async deleteOne(id: string) {
    const toBeDeleted = this.findOne(id);
    if (!toBeDeleted) return null;

    await this.userModel.deleteOne({ _id: id }).exec();
    return toBeDeleted;
  }
  async getPosts() {
    return this.userModel.find().exec();
  }
  async findOne(filter: Object) {
    return this.userModel.findOne(filter);
  }
  async updateUser(id: string, updatedUser: CreateUserType) {
    const existingUser = await this.userModel.findById(id).exec();
    if (!existingUser) {
      return null;
    }
    existingUser.set(updatedUser);

    await existingUser.save();
    return existingUser;
  }
  async createUser(userDetails: CreateUserType) {
    //if (postDetails._id) delete postDetails._id;
    const createdUser = new this.userModel(userDetails);
    await createdUser.save();
    return createdUser;
  }
}
