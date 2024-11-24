import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/services/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TokenRevokeServiceService } from './token-revoke-service/token-revoke-service.service';
import * as bcrypt from 'bcrypt';
import Log from 'src/log';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenRevokeService: TokenRevokeServiceService,
  ) { }

  async verifyToken(token: any) {
    Log.info('Verifying token', token);
    if (!token) {
      Log.error('Invalid token');
      throw new Error('Invalid token');
    }
    return this.jwtService.verify(token);
  }

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneWithPassword({ email: username });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const match = await bcrypt.compare(pass, user.password);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...result } = user;
    const payload = { sub: user.id, username: user.email };
    const access_token = await this.jwtService.signAsync(payload);
    Log.info(access_token, ' of the user with id ', user.id);

    return {
      access_token,
      user: result
    };
  }

  async signUp(username: string, pass: string): Promise<any> {
    const user = await this.usersService.createUser({
      email: username,
      password: pass,
    });
    const { password, ...result } = user;
    const payload = { sub: user.id, username: user.email };
    const access_token = await this.jwtService.signAsync(payload);
    Log.info(access_token, ' of the user with id ', user.id);
    
    return {
      access_token,
      user: result
    };
  }

  async signOut(jwt: string): Promise<void> {
    this.tokenRevokeService.revokeToken(jwt);
  }
}
