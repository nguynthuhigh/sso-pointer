import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { OtpService } from './otp.service';
import { VerifyUserDto } from '../dto/verify-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';
import { getTokenDto } from '../dto/get-token.dto';
import { Code } from '../schemas/code.schema';
import { Token } from '../schemas/token.schema';
import { RedisService } from '../../common/database/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private otpService: OtpService,
    private readonly redisService: RedisService,
    @InjectModel(Code.name) private readonly codeModel: Model<Code>,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}
  async signUp(createUser: CreateUserDto): Promise<any> {
    const user = await this.usersService.findOne(createUser.email);
    if (user) {
      throw new BadRequestException('Email is already exsits');
    }
    const hash = await bcrypt.hash(createUser.password, 10);
    await this.otpService.sendOTP({
      to: createUser.email,
      password: hash,
    });
    return { message: 'Check your email!' };
  }
  async verifySignUp(
    verifyUser: VerifyUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const data = await this.otpService.verifyOTP(verifyUser);
    const createdUser = await this.usersService.create({
      email: data.email,
      password: data.password,
    });
    const tokens = await this.tokenService.signToken({
      id: createdUser._id.toString(),
      secretAccess: process.env.ACCESS_KEY,
      secretRefresh: process.env.REFRESH_KEY,
    });
    return tokens;
  }
  async signIn(signIn: CreateUserDto): Promise<any> {
    const foundUser = await this.usersService.findOne(signIn.email);
    if (!foundUser) {
      throw new BadRequestException('Email or password is wrong');
    }
    if ((await bcrypt.compare(signIn.password, foundUser.password)) === false) {
      throw new BadRequestException('Email or password is wrong');
    }
    const tokens = await this.tokenService.signToken({
      id: foundUser._id.toString(),
      secretAccess: process.env.ACCESS_KEY,
      secretRefresh: process.env.REFRESH_KEY,
    });
    return tokens;
  }
  async requestAuthorize(id: string, email: string) {
    const code = randomBytes(12);
    await this.redisService.setKey(
      code.toString('hex'),
      JSON.stringify({
        id: id,
        email: email,
      }),
    );
    return { code: code.toString('hex') };
  }
  async getAccessToken(getAccessToken: getTokenDto) {
    const result = await this.redisService.getKey(getAccessToken.code);
    const { email, id } = JSON.parse(result);
    const token = await this.tokenService.signAccessTokenPair(
      JSON.parse(result).id,
      JSON.parse(result).email,
    );
    return { ...token, email, id };
  }
  async verifyTokenSSO(accessToken: string) {
    const payload = await this.tokenService.verifyTokenSSO(
      accessToken,
      process.env.SSO_PUBLIC_KEY,
    );
    const token = await this.redisService.getKey(payload.id);
    if (!token) {
      throw new UnauthorizedException();
    }
    return payload;
  }
  async refreshToken(refreshToken: string, id: string) {
    // await this.tokenService.verifyToken(refreshToken, process.env.REFRESH_KEY);
    // const tokens = await this.tokenService.updateToken({
    //   id: id,
    //   secretAccess: process.env.ACCESS_KEY,
    //   secretRefresh: process.env.REFRESH_KEY,
    //   refreshToken: refreshToken,
    // });
    // return tokens;
  }
  async refreshSSO(refreshToken: string, id: string) {
    // await this.tokenService.verifyToken(refreshToken, process.env.REFRESH_KEY);
    // const tokens = await this.tokenService.updateToken({
    //   id: id,
    //   secretAccess: process.env.ACCESS_KEY,
    //   secretRefresh: process.env.REFRESH_KEY,
    //   refreshToken: refreshToken,
    // });
    // return tokens;
  }
}
