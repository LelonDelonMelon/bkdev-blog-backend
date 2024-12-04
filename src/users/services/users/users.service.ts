import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserType } from 'src/utils/types';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import Log from 'src/log';

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
      const found = await this.userModel.findOne(data).select('_id').lean().exec();
      if (found) {
        const objectId = new Types.ObjectId(found.id);
        const user = {
          id: objectId.toString(),
          email: found.email,
          createdAt: objectId.getTimestamp()
        };
        Log.info('Found user', user);
        return user;
      }
      return Log.error('User not found');
    } catch (err) {
      Log.error('Error: ', err);
      return null;
    }
  }

  async findOneWithPassword(data) {
    try {
      const found = await this.userModel.findOne(data).lean().exec();
      if (found) {
        const objectId = new Types.ObjectId(found.id);
        return {
          ...found,
          id: objectId.toString(),
          createdAt: objectId.getTimestamp()
        };
      }
      return null;
    } catch (err) {
      Log.error('Error: ', err);
      return null;
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
    const objectId = new Types.ObjectId();

    const createdUser = new this.userModel({
      ...userDetails,
      password: hashedPassword,
      _id: objectId
    });

    const savedUser = await createdUser.save();
    return {
      ...savedUser.toObject(),
      id: objectId.toString(),
      createdAt: objectId.getTimestamp()
    };
  }
}
