import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserType } from 'src/utils/types';
import { InjectModel } from '@nestjs/mongoose';

let allData = [];
@Injectable()
export class UsersService {
  mockData = [
    { title: 'Deneme title 1', details: 'details 1', date: 'deneme' },
  ];
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
  async findOne(id: string) {
    return this.userModel.findById(id);
  }
  async updatePost(id: string, updatedUser: CreateUserType) {
    const existingPost = await this.userModel.findById(id).exec();
    if (!existingPost) {
      return null;
    }
    existingPost.set(updatedUser);

    await existingPost.save();
    return existingPost;
  }
  async createPost(userDetails: CreateUserType) {
    //if (postDetails._id) delete postDetails._id;
    const createdPost = new this.userModel(userDetails);
    await createdPost.save();
    return createdPost;
  }
}
