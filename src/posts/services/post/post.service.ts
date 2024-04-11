import { Injectable, Inject } from '@nestjs/common';
import { CreatePostType } from 'src/utils/types';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/schemas/post.schema';

let allData = [];

@Injectable()
export class PostService {
  mockData = [
    { title: 'Deneme title 1', details: 'details 1', date: 'deneme' },
  ];
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {
    allData.push(this.getPosts());
  }
  async deleteOne(id: string) {
    const toBeDeleted = this.findOne(id);
    if (!toBeDeleted) return null;

    await this.postModel.deleteOne({ _id: id }).exec();
    return toBeDeleted;
  }
  async getPosts() {
    console.log('LOG', (await this.postModel.find().exec()).length);
    return this.postModel.find().exec();
  }
  async findOne(id: string) {
    console.log('LOG', await this.postModel.findById(id));
    return this.postModel.findById(id);
  }
  async updatePost(id: string, updatedPost: CreatePostType) {
    const existingPost = await this.postModel.findById(id).exec();
    if (!existingPost) {
      return null;
    }
    existingPost.set(updatedPost);

    await existingPost.save();
    return existingPost;
  }
  async createPost(postDetails: CreatePostType) {
    //if (postDetails._id) delete postDetails._id;
    const createdPost = new this.postModel(postDetails);
    await createdPost.save();
    return createdPost;
  }
}
