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

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
