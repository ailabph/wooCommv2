import { Test, TestingModule } from '@nestjs/testing';
import { IreferReferralService } from './irefer-referral.service';

describe('IreferReferralService', () => {
  let service: IreferReferralService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IreferReferralService],
    }).compile();

    service = module.get<IreferReferralService>(IreferReferralService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
