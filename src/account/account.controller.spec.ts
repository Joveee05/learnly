import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

describe('AccountController', () => {
  let controller: AccountController;
  let AccountService: AccountService;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [AccountController],
  //     providers: [AccountService],
  //   }).compile();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [AccountService],
    }).compile();

    AccountController = moduleRef.get<AccountController>(AccountController);
    AccountService = moduleRef.get<AccountService>(AccountService);
  })

  describe('createAccount', () => {
    it('it should return Account created successfully', async () => {
      const account = {
        name: 'Test Account',
        description: 'Test Account Description',
        type: 'Test Account Type',
        balance: 1000,
      };

      const user = {
        id: '1',
        token: 'test token',
        role: 'test role',
        expireIn: 'test expireIn',
      }

      const result: string = 'Account created successfully';

      // jest.spyOn(AccountService, 'createAcct').mockImplementation(() =>c result);
      // expect(await AccountController.createAcct(account, user)).toBe(result);
    });

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });
