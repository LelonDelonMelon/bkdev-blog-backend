import { Test, TestingModule } from '@nestjs/testing';
import { TokenRevokeServiceService } from './token-revoke-service.service';

describe('TokenRevokeServiceService', () => {
  let service: TokenRevokeServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenRevokeServiceService],
    }).compile();

    service = module.get<TokenRevokeServiceService>(TokenRevokeServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
