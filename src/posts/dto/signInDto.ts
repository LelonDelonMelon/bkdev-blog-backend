import { IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  readonly email: string;
  @IsNotEmpty()
  readonly password: string;
}
