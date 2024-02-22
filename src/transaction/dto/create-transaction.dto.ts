import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The userId' })
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'The transaction amount' })
  amount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The transaction type' })
  type: string;

  @IsNumber()
  @ApiProperty({
    description: 'The destination account number for transaction',
  })
  destAcctNumber?: number;
}
