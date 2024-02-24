import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transaction.model';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../users/users.model';
import { AccountService } from '../account/account.service';
import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        TransactionService,
        AccountService,
        UsersService,
        PassportModule,
        {
          provide: getModelToken('Transaction'),
          useValue: Model,
        },
        {
          provide: getModelToken('Account'),
          useValue: Model,
        },
        {
          provide: getModelToken('User'),
          useValue: Model,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      const createTransactionDto: CreateTransactionDto = {
        // Populate DTO as needed for testing
        userId: '12344',
        amount: 100,
        type: 'credit',
      };
      const mockUser: User = {
        id: 'user-id',
        name: 'Old Name',
        email: 'old@example.com',
        role: 'admin',
        phone_number: 123456789,
        password: '123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
        // Populate user properties as needed for testing
      };

      const mockTransaction: Transaction = {
        // Populate mock transaction as needed for testing
        id: '',
        userId: '12344',
        amount: 100,
        type: 'credit',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(service, 'createTransaction')
        .mockResolvedValueOnce(mockTransaction);

      const result = await controller.Transactions(
        createTransactionDto,
        mockUser,
      );

      expect(result).toEqual(mockTransaction);
      expect(service.createTransaction).toHaveBeenCalledWith(
        mockUser.id,
        createTransactionDto,
      );
    });
  });

  describe('getUserTransactions', () => {
    it('should get user transactions', async () => {
      const userId = 'user-id';
      const mockTransactions: Transaction[] = [
        // Populate mock transactions as needed for testing
      ];

      jest
        .spyOn(service, 'getTransactionsByUser')
        .mockResolvedValueOnce(mockTransactions);

      const result = await controller.getUserTransactions(userId);

      expect(result).toEqual(mockTransactions);
      expect(service.getTransactionsByUser).toHaveBeenCalledWith(userId);
    });
  });
});
