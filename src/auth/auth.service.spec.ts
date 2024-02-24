import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockJwtService = {
      sign: jest.fn().mockImplementation(() => 'jwt-token'),
    };

    const mockUserModel = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: getModelToken('User'), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUserByPassword', () => {
    it('should return a JWT token if the credentials are valid', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
      };
      const loginAttempt = {
        email: 'test@example.com',
        password: 'password123',
      };
      userService.getUserByEmail = jest.fn().mockResolvedValue(user);
      userService.comparePasswords = jest.fn().mockResolvedValue(true);
      const result = await service.validateUserByPassword(loginAttempt);
      expect(result).toEqual({
        id: user.id,
        token: 'jwt-token',
        role: user.role,
        expiresIn: 24 * 60 * 60,
      });
    });

    it('should throw UnauthorizedException if the credentials are invalid', async () => {
      const loginAttempt = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      userService.getUserByEmail = jest.fn().mockResolvedValue(null);
      await expect(
        service.validateUserByPassword(loginAttempt),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return a JWT token if the user exists', async () => {
      const user = { id: 1, email: 'test@example.com', role: 'user' };
      const payload = { email: 'test@example.com' };
      userService.getUserByEmail = jest.fn().mockResolvedValue(user);
      const result = await service.validateUser(payload);
      expect(result).toEqual({
        id: user.id,
        token: 'jwt-token',
        role: user.role,
        expiresIn: 24 * 60 * 60,
      });
    });

    it('should throw UnauthorizedException if the user does not exist', async () => {
      const payload = { email: 'nonexistent@example.com' };
      userService.getUserByEmail = jest.fn().mockResolvedValue(null);
      await expect(service.validateUser(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
