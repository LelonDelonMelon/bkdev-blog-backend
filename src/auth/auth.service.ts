import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/services/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string, id: string): Promise<any> {
    const user = await this.usersService.findOne(id);
    console.log('From service', username, pass, id, user);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    const payload = { sub: user._id, username: user.email };
    const access_token = await this.jwtService.signAsync(payload);
    console.log(access_token);
    return access_token;
  }
  async signUp(username: string, pass: string): Promise<any> {
    const user = await this.usersService.createUser({
      email: username,
      password: pass,
    });
    const { password, ...result } = user;
    const payload = { sub: user._id, username: user.email };
    const access_token = await this.jwtService.signAsync(payload);
    console.log(access_token, 'of the user with id ', user._id);
    return access_token;
  }
}
