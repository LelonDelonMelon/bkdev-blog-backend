import { IsDate, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly details: string;

  readonly date: string;
  readonly id: string;
}
