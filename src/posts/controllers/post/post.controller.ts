import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
  Param,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { isDate } from 'class-validator';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { PostService } from 'src/posts/services/post/post.service';

@Controller('post')
export class PostController {
  //Inject the service to the controller
  constructor(private postService: PostService) {}

  @Get('/')
  getPosts() {
    return this.postService.getPosts();
  }
  @Get('/:id')
  getPostById(@Param('id') id: string) {
    const post = this.postService.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }
  @Post('/new')
  createPost(@Body() postData: CreatePostDto) {
    console.log(postData);
    return this.postService.createPost(postData);
  }
  @Delete('/:id')
  deletePost(@Param('id') id: string) {
    console.log('Deleting post with id', id);
    return this.postService.deleteOne(id);
  }
  @Put('/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatedPost: CreatePostDto,
  ) {
    const existingPost = await this.postService.updatePost(id, updatedPost);

    return updatedPost;
  }
}
