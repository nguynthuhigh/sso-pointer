import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './interface/user.interface';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    console.log(process.env.MONGODB_URI);
    const data = await this.usersService.create(createUserDto);
    return data;
  }
}
