import { Injectable, Inject } from '@nestjs/common';
import { CreatePostType } from 'src/utils/types';
import { Model } from 'mongoose';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/schemas/post.schema';
@Injectable()
export class PostService {
  mockData = [
    { title: 'Deneme title 1', details: 'details 1', date: 'deneme', id: '1' },
  ];
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  getPosts() {
    return this.postModel.find().exec();
  }
  findOne(id: string): CreatePostType {
    return this.mockData.find((post) => post.id === id);
  }
  async createPost(postDetails: CreatePostType) {
    const createdPost = new this.postModel(postDetails);
    return createdPost;
  }
  getPostById(id: string) {
    console.log(id);
    return { id, title: 'deneme', details: 'deneme 2', date: '2-2-2' };
  }
}
