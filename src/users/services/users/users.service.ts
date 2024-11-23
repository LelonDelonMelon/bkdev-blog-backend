import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserType } from 'src/utils/types';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';

let allData = [];
@Injectable()
export class UsersService {
  mockData = [{ email: 'deneme@123gmail.com', password: 'deneme123' }];

  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    //for caching
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
  async findOne(data) {
    try {
      const found = await this.userModel.findOne(data);
      console.log(found);
      return found;
    } catch (err) {
      console.log('Error: ', err);
    }
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
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userDetails.password, salt);

    const createdUser = new this.userModel({
      ...userDetails,
      password: hashedPassword,
      _id: new Types.ObjectId(),
    });

    console.log('Created user:', createdUser);
    return await createdUser.save();
  }
}
