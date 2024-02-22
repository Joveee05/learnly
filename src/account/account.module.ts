import { UsersModule } from 'src/users/users.module';
import { accountSchema } from './account.model';
import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';
import { UserSchema } from 'src/users/users.model';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Account', schema: accountSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    UsersModule,
  ],
  controllers: [AccountController],
  providers: [AccountService, UsersService],
})
export class AccountModule {}
