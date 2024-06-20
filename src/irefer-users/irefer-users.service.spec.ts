import { Test, TestingModule } from '@nestjs/testing';
import { IreferUsersService } from './irefer-users.service';

describe('IreferUsersService', () => {
  let service: IreferUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IreferUsersService],
    }).compile();

    service = module.get<IreferUsersService>(IreferUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
