import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/services/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TokenRevokeServiceService } from './token-revoke-service/token-revoke-service.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenRevokeService: TokenRevokeServiceService,
  ) { }

  async verifyToken(token: any) {
    console.log("INFO: TOKEN", token);
    if (!token)
      throw new Error('Invalid token');
    return this.jwtService.verify(token);
  }
  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ email: username });

    const match = await bcrypt.compare(pass, user.password);
    console.log(" From controller", pass, user.password);
    console.log('From service', username, pass, user.password, match);

    if (!match) {
      throw new UnauthorizedException();
    }

    const { password, ...result } = user;
    const payload = { sub: user._id, username: user.email };
    const access_token = await this.jwtService.signAsync(payload);
    console.log("INFO : ACCESS TOKEN", access_token);
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
    console.log(access_token, ' of the user with id ', user._id);
    return access_token;
  }

  async signOut(jwt: string): Promise<void> {
    this.tokenRevokeService.revokeToken(jwt);
  }
}
