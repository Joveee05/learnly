import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsNumberString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccountDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Account name' })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'User Account balance' })
  balance: number;

  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({ description: 'User Account reference Id' })
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'User Account number' })
  accountNumber: number;
}
