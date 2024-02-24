import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from './account.model';
import { UsersService } from '../users/users.service';

describe('UsersService', () => {
  let service: AccountService;
  let model: Model<Account>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        UsersService,
        {
          provide: getModelToken('Account'),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
        {
          provide: getModelToken('User'), // Mock UserModel if needed
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    model = module.get<Model<Account>>(getModelToken('Account'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of accounts', async () => {
      const user = {
        id: '123445',
        name: 'Old Name',
        email: 'old@example.com',
        role: 'admin',
        phone_number: 123456789,
        password: '123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = [
        {
          name: 'Old Name',
          balance: 123456789,
          userId: '123455',
          accountNumber: 123456789,
        },
        {
          name: 'Old Name',
          balance: 123456789,
          userId: '123455',
          accountNumber: 123456789,
        },
      ];
      jest.spyOn(model, 'find').mockResolvedValue(result);

      expect(await service.getAccts(user)).toEqual(result);
    });
  });
});
