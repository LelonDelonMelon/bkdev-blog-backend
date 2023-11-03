import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenRevokeServiceService {
  private revokedTokens: Set<string> = new Set();

  async revokeToken(token: string): Promise<void> {
    console.log('revoking token: ', token);
    this.revokedTokens.add(token);
  }

  async isTokenRevoked(token: string): Promise<boolean> {
    console.log('is Token revoked? : ', token);
    return this.revokedTokens.has(token);
  }
}
