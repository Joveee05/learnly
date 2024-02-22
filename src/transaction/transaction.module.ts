import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './transaction.model';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { UserSchema } from 'src/users/users.model';
import { PassportModule } from '@nestjs/passport';
import { AccountModule } from 'src/account/account.module';
import { AccountService } from 'src/account/account.service';
import { accountSchema } from 'src/account/account.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
    ]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Account', schema: accountSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    UsersModule,
    AccountModule,
  ],
  providers: [TransactionService, UsersService, AccountService],
  controllers: [TransactionController],
})
export class TransactionModule {}
