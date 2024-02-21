import { UpdateUserDto } from './dto/update-user.dto';
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from './users.model';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User created successful.' })
  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    const userId = await this.userService.createUser(createUserDto);
    return userId;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns array of registered users',
  })
  @Get('users')
  @UseGuards(AuthGuard())
  async getUsers(@GetUser() user: User): Promise<any> {
    const users = await this.userService.getUsers(user);
    return users;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user' })
  @ApiResponse({
    status: 200,
    description: 'Returns a user with the given id',
  })
  @Get('users/:id')
  @UseGuards(AuthGuard())
  async getUser(@Param('id') id: string): Promise<any> {
    const user = await this.userService.getUser(id);
    return user;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete user by Id' })
  @ApiResponse({
    status: 200,
    description: 'Returns user deleted successfully',
  })
  @Delete('users/:id')
  @UseGuards(AuthGuard())
  async deleteUser(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<any> {
    return await this.userService.deleteUserById(id, user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user by Id' })
  @ApiResponse({
    status: 200,
    description: 'Returns user updated successfully',
  })
  @Patch('users/:id')
  @UseGuards(AuthGuard())
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ): Promise<any> {
    return await this.userService.updateUserById(id, user, updateUserDto);
  }
}
