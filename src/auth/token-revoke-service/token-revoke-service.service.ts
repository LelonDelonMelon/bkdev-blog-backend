import { Injectable } from '@nestjs/common';
import Log from 'src/log';
@Injectable()
export class TokenRevokeServiceService {
  private revokedTokens: Set<string> = new Set();

  async revokeToken(token: string): Promise<void> {
    Log.info('revoking token: ', token);
    this.revokedTokens.add(token);
  }

  async isTokenRevoked(token: string): Promise<boolean> {
    Log.info('is Token revoked? : ', token);
    return this.revokedTokens.has(token);
  }
}
