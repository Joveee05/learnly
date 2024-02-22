import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountDto } from './dto/account.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/users/users.model';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Account')
@Controller('/api/v1/accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @ApiOperation({ summary: 'Create an account' })
  @ApiResponse({ status: 201, description: 'Account created successful.' })
  @Post()
  @UseGuards(AuthGuard())
  async createAcct(
    @Body() accountDto: AccountDto,
    @GetUser() user: User,
  ): Promise<any> {
    const account = await this.accountService.createAcct(accountDto, user);
    return account;
  }

  @ApiOperation({ summary: 'Get all user accounts' })
  @ApiResponse({
    status: 200,
    description: 'Returns array of user accounts',
  })
  @Get()
  @UseGuards(AuthGuard())
  async getAccounts(@GetUser() user: User) {
    const accounts = await this.accountService.getAccts(user);
    return accounts;
  }

  @ApiOperation({ summary: 'Get account' })
  @ApiResponse({
    status: 200,
    description: 'Returns account',
  })
  @Get(':id')
  @UseGuards(AuthGuard())
  async getAccount(@Param('id') id: string) {
    const account = await this.accountService.getAcct(id);
    return account;
  }

  @ApiOperation({ summary: 'Update account' })
  @ApiResponse({
    status: 200,
    description: 'Updates account',
  })
  @Patch(':id')
  @UseGuards(AuthGuard())
  async updateAccount(@Param('id') id: string, balance: number) {
    const account = await this.accountService.updateAcct(id, balance);
    return account;
  }

  @ApiOperation({ summary: 'Get account by account number' })
  @ApiResponse({
    status: 200,
    description: 'Returns account',
  })
  @Post('find_by_number')
  @UseGuards(AuthGuard())
  async getByAccountNum(@Body('number') number: number) {
    const account = await this.accountService.getAcctByAcctNumber(number);
    return account;
  }
}
