import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseFilters,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './interface/user.interface';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    console.log(process.env.MONGODB_URI);
    const data = await this.usersService.create(createUserDto);
    return data;
  }
  @Post('get-users')
  async getUsers(): Promise<User> {
    throw new BadRequestException('Lỗi');
  }
}
