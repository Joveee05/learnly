import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { PassportModule } from '@nestjs/passport';

describe('UserController', () => {
  let controller: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUsers: jest.fn(),
            getUser: jest.fn(),
            findByEmail: jest.fn(),
            createUser: jest.fn(),
            updateUserById: jest.fn(),
            deleteUserById: jest.fn(),
          },
        },
        PassportModule,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
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
      const users: User[] = [
        {
          id: '1',
          name: 'User 1',
          email: 'user1@example.com',
          password: 'test',
          phone_number: 32424252,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(userService, 'getUsers').mockResolvedValue(users);

      expect(await controller.getUsers(user)).toBe(users);
    });
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'test1234',
        phone_number: '32323232',
      };
      const newUser: User = {
        id: '2',
        name: 'New User',
        email: 'newuser@example.com',
        password: 'test1234',
        role: 'user',
        phone_number: 32323232,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(userService, 'createUser').mockResolvedValue(newUser);

      expect(await controller.create(createUserDto)).toBe(newUser);
    });
  });

  describe('getUser', () => {
    it('should return a user by ID', async () => {
      const userId = '1';
      const user: User = {
        id: userId,
        name: 'User 1',
        email: 'user1@example.com',
        password: 'test1234',
        role: 'user',
        phone_number: 32323232,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(userService, 'getUser').mockResolvedValue(user);

      expect(await controller.getUser(userId)).toBe(user);
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const userId = '1';
      const user = {
        id: '123345',
        name: 'Old Name',
        email: 'old@example.com',
        role: 'admin',
        phone_number: '123456789',
        password: '123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // const updateUserDto: UpdateUserDto = {
      //   name: 'Updated User',
      //   email: 'user1@example.com',
      //   password: 'test1234',
      //   phone_number: '32323232',
      // };
      const updatedUser: User = {
        id: userId,
        name: 'Updated User',
        email: 'user1@example.com',
        password: 'test1234',
        role: 'user',
        phone_number: 32323232,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(userService, 'updateUserById').mockResolvedValue(updatedUser);

      expect(await controller.updateUser(userId, user, updatedUser)).toBe(
        updatedUser,
      );
    });
  });

  describe('delete', () => {
    it('should delete a user by ID', async () => {
      const userId = '1';
      const user = {
        id: '123345',
        name: 'Old Name',
        email: 'old@example.com',
        role: 'admin',
        phone_number: 123456789,
        password: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const deletedUser: User = {
        id: userId,
        name: 'User 1',
        email: 'user1@example.com',
        password: 'test1234',
        role: 'user',
        phone_number: 32323232,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(userService, 'deleteUserById').mockResolvedValue(deletedUser);

      expect(await controller.deleteUser(userId, user)).toBe(deletedUser);
    });
  });
});
