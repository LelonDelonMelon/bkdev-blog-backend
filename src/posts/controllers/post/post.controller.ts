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
    //return a single post
    const post = this.postService.findOne(id);

    if (!post)
      throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
    return post;
  }
  @Post('/new')
  createPost(@Body() postData: CreatePostDto) {
    console.log(postData);
    return this.postService.createPost(postData);
  }
  @Delete('/:id')
  deletePost() {
    return 'deleted post';
  }
  @Put('/:id')
  updatePost() {
    return 'updated post with id: ';
  }
}
