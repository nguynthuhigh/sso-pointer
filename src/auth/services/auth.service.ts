import { BadRequestException, Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { OtpService } from './otp.service';
import { VerifyUserDto } from '../dto/verify-user.dto';
@Injectable()
@UseFilters(HttpExceptionFilter)
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private otpService: OtpService,
  ) {}
  async signUp(createUser: CreateUserDto): Promise<any> {
    const user = await this.usersService.findOne(createUser.email);
    if (user) {
      throw new BadRequestException('Email is already exsits');
    }
    const hash = await bcrypt.hash(createUser.password, 10);
    this.otpService.sendOTP({
      to: createUser.email,
      password: hash,
    });
    return { message: 'Check your email!' };
  }
  async verifySignUp(verifyUser: VerifyUserDto): Promise<any> {
    const data = await this.otpService.verifyOTP(verifyUser);
    // console.log(hash);
    // console.log(createUser);
    const createdUser = await this.usersService.create({
      email: data.email,
      password: data.password,
    });
    const tokens = await this.tokenService.signToken({
      id: createdUser._id.toString(),
      secretAccess: '123',
      secretRefresh: '123',
    });
    console.log(tokens);
    return tokens;
  }
}
