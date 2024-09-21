import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { User } from './interface/user.interface';
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const data = await this.usersService.create(createUserDto);
    return data;
  }
  @Post('get-users')
  async getUsers(): Promise<User[]> {
    const data = await this.usersService.get();
    return data;
  }
}
