import { Body, Controller, Get, Post, Req, UseFilters } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { User } from './interface/user.interface';
import { Request } from 'express';
@Controller('user')
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
  @Get('profile')
  async getProfile(@Req() req: Request) {
    console.log(req['user']);
    return req['user'];
  }
  @Get('profile-authorize')
  async getProfileAuthorize(@Req() req: Request) {
    console.log(req['user']);
    return req['user'];
  }
}
