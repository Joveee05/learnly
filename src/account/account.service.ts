import { UsersService } from './../users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from './account.model';
import { AccountDto } from './dto/account.dto';
import { User } from 'src/users/users.model';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel('Account') private readonly AccountModel: Model<Account>,
    private userService: UsersService,
  ) {}

  async createAcct(
    accountDto: AccountDto,
    user: User,
  ): Promise<Account | null> {
    if (user.role !== 'admin') {
      throw new NotFoundException('Unauthorized to create account.');
    }
    const newAccount = new this.AccountModel(accountDto);
    const account = await newAccount.save();

    if (!account) {
      throw new NotFoundException('Could not create account.');
    }

    return account;
  }

  async getAccts(user: User): Promise<Account[]> {
    const accounts = await this.AccountModel.find();
    if (user.role === 'admin') {
      return accounts.map(
        (account): Account => ({
          id: account.id,
          name: account.name,
          balance: account.balance,
          userId: account.userId,
          accountNumber: account.accountNumber,
        }),
      );
    } else {
      throw new NotFoundException('Unauthorized to view all accounts.');
    }
  }

  async getAcct(id: string): Promise<Account> {
    const user = await this.userService.getUser(id);
    const account = await this.AccountModel.findOne({
      userId: user.id,
    }).exec();
    if (user.id === account.userId.toString()) {
      return {
        id: account.id,
        name: account.name,
        balance: account.balance,
        userId: account.userId,
        accountNumber: account.accountNumber,
      };
    } else {
      throw new NotFoundException('Account does not belong to user.');
    }
  }

  async updateAcct(id: string, balance: number): Promise<Account> {
    const user = await this.userService.getUser(id);
    const account = await this.AccountModel.findOne({ userId: user.id }).exec();
    if (user.id === account.userId.toString()) {
      account.balance = balance;
      account.save();
      return account;
    } else {
      throw new NotFoundException('Account does not belong to user.');
    }
  }

  async getAcctByAcctNumber(accountNumber: number): Promise<Account> {
    const account = await this.AccountModel.findOne({ accountNumber }).exec();
    if (!account) {
      throw new NotFoundException(
        'No account found with this number. Please check that the account number is correct',
      );
    }
    return account;
  }
}
