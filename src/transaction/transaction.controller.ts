import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AuthGuard } from '@nestjs/passport';
import { Transaction } from './transaction.model';
import { User } from '../users/users.model';
import { GetUser } from '../decorator/get-user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Transaction')
@Controller('/api/v1/transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @ApiOperation({ summary: 'Create a transaction, with transaction types' })
  @ApiResponse({ status: 201, description: 'Transaction created successful.' })
  @Post()
  @UseGuards(AuthGuard())
  async Transactions(
    @Body() createTransactionDto: CreateTransactionDto,
    @GetUser() user: User,
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(
      user.id,
      createTransactionDto,
    );
  }

  @ApiOperation({ summary: 'Get all user transactions' })
  @ApiResponse({
    status: 200,
    description: 'Returns array of user transactions',
  })
  @Get('/:id')
  @UseGuards(AuthGuard())
  async getUserTransactions(
    @Param('User Id') id: string,
  ): Promise<Transaction[]> {
    return this.transactionService.getTransactionsByUser(id);
  }
}
