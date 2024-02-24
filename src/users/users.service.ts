import { UpdateUserDto } from './dto/update-user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userModel.create(createUserDto);
    return newUser;
  }

  async comparePasswords(
    attemptPassword: string,
    password: string,
  ): Promise<boolean> {
    return await bcrypt.compare(attemptPassword, password);
  }

  async getUsers(user: User): Promise<User[]> {
    const users = await this.userModel.find();
    if (user.role === 'admin') {
      return users
        .filter((user) => user.role !== 'admin')
        .map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          phone_number: user.phone_number,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }));
    } else {
      throw new NotFoundException('No users.');
    }
  }

  async getUser(userId: string): Promise<User> {
    let user: User;
    try {
      user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('Could not find user.');
      }
      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async deleteUserById(userId: string, user: User): Promise<User> {
    if (user.role === 'admin') {
      return await this.userModel.findByIdAndDelete(userId);
    } else {
      throw new NotFoundException('Unauthorized to delete user.');
    }
  }

  async updateUserById(
    userId: string,
    user: User,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (user.role === 'admin') {
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        updateUserDto,
        {
          new: true,
        },
      );

      try {
        if (!user) {
          throw new NotFoundException('Could not find user.');
        }
        return user;
      } catch (error) {
        throw new NotFoundException('Could not find user.');
      }
    } else {
      throw new NotFoundException('Unauthorized to update user.');
    }
  }
}
