import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './transaction.model';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AccountService } from '../account/account.service';
import { NotFoundException } from '@nestjs/common';

describe('TransactionService', () => {
  let service: TransactionService;
  let mockTransactionModel: Model<Transaction>;
  let mockAccountService: {
    getAcct: jest.Mock<any, string[]>;
    updateAcct: jest.Mock<any, string[]>;
    getAcctByAcctNumber: jest.Mock<any, number[]>;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getModelToken('Transaction'),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            prototype: {
              save: jest.fn(),
            },
          },
        },
        {
          provide: AccountService,
          useValue: {
            getAcct: jest.fn(),
            updateAcct: jest.fn(),
            getAcctByAcctNumber: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    mockTransactionModel = module.get<Model<Transaction>>(
      getModelToken('Transaction'),
    );
    mockAccountService = module.get(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a credit transaction', async () => {
      const userId = 'user1';
      const createTransactionDto: CreateTransactionDto = {
        userId: '12344',
        amount: 100,
        type: 'credit',
      };
      const account = { balance: 200 };
      const expectedTransaction = { _id: '1', ...createTransactionDto, userId };

      mockAccountService.getAcct.mockResolvedValue(account);
      mockTransactionModel.prototype.save.mockResolvedValue(
        expectedTransaction,
      );

      const result = await service.createTransaction(
        userId,
        createTransactionDto,
      );

      expect(result).toEqual(expectedTransaction);
      expect(mockAccountService.updateAcct).toHaveBeenCalledWith(userId, 300);
    });

    it('should throw NotFoundException for insufficient funds during debit', async () => {
      const userId = 'user1';
      const createTransactionDto: CreateTransactionDto = {
        userId: '12344',
        amount: 300,
        type: 'debit',
      };
      const account = { balance: 200 };

      mockAccountService.getAcct.mockResolvedValue(account);

      await expect(
        service.createTransaction(userId, createTransactionDto),
      ).rejects.toThrowError(NotFoundException);
      expect(mockAccountService.updateAcct).not.toHaveBeenCalled();
    });

    it('should create a debit transaction', async () => {
      const userId = 'user1';
      const createTransactionDto: CreateTransactionDto = {
        userId: '102837',
        amount: 50,
        type: 'debit',
      };
      const account = { balance: 100 };
      const expectedTransaction = { _id: '1', ...createTransactionDto, userId };

      mockAccountService.getAcct.mockResolvedValue(account);
      mockTransactionModel.prototype.save.mockResolvedValue(
        expectedTransaction,
      );

      const result = await service.createTransaction(
        userId,
        createTransactionDto,
      );

      expect(result).toEqual(expectedTransaction);
      expect(mockAccountService.updateAcct).toHaveBeenCalledWith(userId, 50);
    });

    it('should throw NotFoundException for insufficient funds during transfer', async () => {
      const userId = 'user1';
      const createTransactionDto: CreateTransactionDto = {
        userId: '12345',
        amount: 300,
        type: 'transfer',
        destAcctNumber: 2098765,
      };
      const account = { balance: 200 };

      mockAccountService.getAcct.mockResolvedValue(account);
      mockAccountService.getAcctByAcctNumber.mockResolvedValue(null);

      await expect(
        service.createTransaction(userId, createTransactionDto),
      ).rejects.toThrowError(NotFoundException);
      expect(mockTransactionModel.prototype.save).not.toHaveBeenCalled();
      expect(mockAccountService.updateAcct).not.toHaveBeenCalled();
    });

    it('should transfer funds successfully', async () => {
      const userId = 'user1';
      const destUserId = 'user2';
      const createTransactionDto: CreateTransactionDto = {
        userId: '123333',
        amount: 50,
        type: 'transfer',
        destAcctNumber: 23456,
      };
      const sourceAccount = { balance: 100 };
      const destAccount = { balance: 200 };

      mockAccountService.getAcct.mockResolvedValue(sourceAccount);
      mockAccountService.getAcctByAcctNumber.mockResolvedValue(destAccount);
      mockTransactionModel.prototype.save.mockResolvedValue({
        _id: '1',
        ...createTransactionDto,
        userId,
      });

      const result = await service.createTransaction(
        userId,
        createTransactionDto,
      );

      expect(result.userId).toEqual(userId);
      expect(mockAccountService.updateAcct).toHaveBeenCalledWith(userId, 50);
      expect(mockAccountService.updateAcct).toHaveBeenCalledWith(
        destUserId,
        250,
      );
    });
  });

  describe('getTransactionsByUser', () => {
    it('should return user transactions', async () => {
      const userId = 'user1';
      const transactions = [
        { _id: '1', amount: 50, type: 'debit', userId },
        { _id: '2', amount: 100, type: 'credit', userId },
      ];

      (mockTransactionModel.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(transactions),
      });

      const result = await service.getTransactionsByUser(userId);

      expect(result).toEqual(transactions);
    });

    it('should throw NotFoundException if user has no transactions', async () => {
      const userId = 'user1';

      const mockFindResult = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });
      (mockTransactionModel.find as jest.Mock).mockReturnValue(mockFindResult);

      await expect(service.getTransactionsByUser(userId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
