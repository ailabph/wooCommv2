import { Test, TestingModule } from '@nestjs/testing';
import { IreferUsersController } from './irefer-users.controller';
import { IreferUsersService } from './irefer-users.service';

describe('IreferUsersController', () => {
  let controller: IreferUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IreferUsersController],
      providers: [IreferUsersService],
    }).compile();

    controller = module.get<IreferUsersController>(IreferUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
