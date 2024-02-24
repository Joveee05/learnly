import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { getModelToken } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: Model,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a user when given valid credentials', async () => {
      const mockUser = { username: 'testuser', email: 'test@example.com' };
      jest
        .spyOn(authService, 'validateUserByPassword')
        .mockResolvedValue(mockUser);

      const mockLoginDto: LoginUserDto = {
        email: 'testuser',
        password: 'password',
      };

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual(mockUser);
    });
  });
});
