import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken('User')); // Replace 'Course' with your actual model name
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const user = {
        id: '123345',
        name: 'Old Name',
        email: 'old@example.com',
        role: 'admin',
        phone_number: 123456789,
        password: '123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = [
        { name: 'John Doe', email: 'abc@abc.com' },
        { name: 'Brian Jovi', email: 'xyz@abc.com' },
      ];
      jest.spyOn(model, 'find').mockResolvedValue(result);

      expect(await service.getUsers(user)).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const userId = '65d67777d741fce5928405d1';
      const result = { name: 'John Doe', email: 'abc@abc.com' };
      jest.spyOn(model, 'findById').mockResolvedValue(result);

      expect(await service.getUser(userId)).toEqual(result);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'New Course',
        email: 'abc@abc.com',
        password: 'test1234',
        phone_number: '32323232',
      };
      const result = {
        _id: '65d63d1fc45da84791ccce94',
        createdAt: '2024-02-21T22:21:43.243Z',
        updatedAt: '2024-02-21T22:21:43.243Z',
        ...userData,
      };
      model.create = jest.fn().mockResolvedValue(result);

      expect(await service.createUser(userData)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const userId = '65d63d1fc45da84791ccce94';
      const user = {
        id: userId,
        name: 'Old Name',
        email: 'old@example.com',
        role: 'admin',
        phone_number: 123456789,
        password: '123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updateData = {
        name: 'New Course',
        email: 'abc@abc.com',
        password: 'test1234',
        role: 'user',
        phone_number: '32323232',
      };
      const result = { _id: userId, ...user, ...updateData };
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(result);

      expect(await service.updateUserById(userId, user, updateData)).toEqual(
        result,
      );
    });
  });

  describe('delete', () => {
    it('should remove a course by ID', async () => {
      const userId = '1234';
      const user = {
        id: userId,
        name: 'Old Name',
        email: 'old@example.com',
        role: 'admin',
        phone_number: 123456789,
        password: '123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = { _id: userId, name: 'Course to be removed' };
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(result);

      expect(await service.deleteUserById(userId, user)).toEqual(result);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'abc@abc.com';
      const result = { name: 'John Doe', email: 'abc@abc.com' };
      jest.spyOn(model, 'findOne').mockResolvedValue(result);

      expect(await service.getUserByEmail(email)).toEqual(result);
    });
  });
});
