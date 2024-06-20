import { Test, TestingModule } from '@nestjs/testing';
import { IreferUserSubscriptionService } from './irefer-user-subscription.service';

describe('IreferUserSubscriptionService', () => {
  let service: IreferUserSubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IreferUserSubscriptionService],
    }).compile();

    service = module.get<IreferUserSubscriptionService>(IreferUserSubscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
