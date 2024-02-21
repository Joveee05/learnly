import { UsersService } from './../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from '../users/users.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserByPassword(loginAttempt: LoginUserDto): Promise<any> {
    const userToAttempt = await this.userService.getUserByEmail(
      loginAttempt.email,
    );
    if (userToAttempt) {
      const { password } = userToAttempt;
      const match = await this.userService.comparePasswords(
        loginAttempt.password,
        password,
      );
      if (match) {
        return this.createJwtPayload(userToAttempt);
      } else {
        throw new UnauthorizedException('Invalid credentials');
      }
    } else {
      throw new UnauthorizedException('User does not exist');
    }
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.userService.getUserByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials or user does not exist',
      );
    }
    return this.createJwtPayload(user);
  }

  createJwtPayload(user: User) {
    const data: JwtPayload = {
      email: user.email,
    };
    const jwt = this.jwtService.sign(data);
    return {
      id: user.id,
      token: jwt,
      role: user.role,
      expiresIn: 24 * 60 * 60,
    };
  }
}
