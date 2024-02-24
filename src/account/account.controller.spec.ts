import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountDto } from './dto/account.dto';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.model';
import { Account } from './account.model';
import { PassportModule } from '@nestjs/passport';

describe('AccountController', () => {
  let controller: AccountController;
  let accountService: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        AccountService,
        UsersService,
        PassportModule,
        {
          provide: getModelToken('Account'),
          useValue: {
            createAcct: jest.fn(),
            getAccounts: jest.fn(),
            getAccount: jest.fn(),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: Model,
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
    accountService = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAcct', () => {
    it('should create an account', async () => {
      const accountDto: AccountDto = {
        name: 'Test Account',
        balance: 100,
        userId: 'mockUserId',
        accountNumber: 123456789,
      };

      const createdAccount = {
        id: 'mockAccountId',
        name: 'Test Account',
        balance: 100,
        userId: 'mockUserId',
        accountNumber: 123456789,
      };

      const mockUser: User = {
        id: '123445',
        name: 'Old Name',
        email: 'old@example.com',
        role: 'admin',
        phone_number: 123456789,
        password: '123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(accountService, 'createAcct')
        .mockResolvedValueOnce(createdAccount);

      const result = await controller.createAcct(accountDto, mockUser);

      const expectedResponse = {
        id: 'mockAccountId',
        name: 'Test Account',
        balance: 100,
        userId: 'mockUserId',
        accountNumber: 123456789,
      };

      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getAccounts', () => {
    it('should get user accounts', async () => {
      const mockUser: User = {
        id: '123445',
        name: 'Old Name',
        email: 'old@example.com',
        role: 'admin',
        phone_number: 123456789,
        password: '123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockAccounts: Account[] = [
        {
          id: 'mockAccountId',
          name: 'Test Account',
          userId: '1233444',
          accountNumber: 20000,
          balance: 100,
        },
        {
          id: 'mockAccountId',
          name: 'Test Account',
          userId: '1233444',
          accountNumber: 20000,
          balance: 100,
        },
      ];

      jest
        .spyOn(accountService, 'getAccts')
        .mockResolvedValueOnce(mockAccounts);

      const result = await controller.getAccounts(mockUser);

      expect(result).toBeDefined();
      expect(result).toEqual(mockAccounts);
    });
  });

  describe('getAccount', () => {
    it('should return an account', async () => {
      const accountId = 'mockAccountId';
      const mockAccount = {
        id: accountId,
        name: 'Test Account',
        balance: 100,
        userId: 'mockUserId',
        accountNumber: 12345,
      };

      jest.spyOn(accountService, 'getAcct').mockResolvedValueOnce(mockAccount);

      const result = await controller.getAccount(accountId);

      expect(result).toEqual(mockAccount);
    });
  });

  describe('updateAccount', () => {
    it('should update an account', async () => {
      const accountId = 'mockAccountId';
      const updatedBalance = 200;
      const updatedAccount = {
        id: accountId,
        name: 'Test Account',
        balance: updatedBalance,
        userId: 'mockUserId',
        accountNumber: 123456,
      };

      jest
        .spyOn(accountService, 'updateAcct')
        .mockResolvedValueOnce(updatedAccount);

      const result = await controller.updateAccount(accountId, updatedBalance);

      expect(result).toEqual(updatedAccount);
    });
  });

  describe('getByAccountNum', () => {
    it('should return an account by account number', async () => {
      const accountNumber = 123456789;
      const mockAccount = {
        id: 'mockAccountId',
        name: 'Test Account',
        balance: 100,
        userId: 'mockUserId',
        accountNumber,
      };

      jest
        .spyOn(accountService, 'getAcctByAcctNumber')
        .mockResolvedValueOnce(mockAccount);

      const result = await controller.getByAccountNum(accountNumber);

      expect(result).toEqual(mockAccount);
    });
  });
});
