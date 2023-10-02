import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Post extends Document {
  @Prop()
  title: string;
  @Prop()
  details: string;
  @Prop()
  date: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
