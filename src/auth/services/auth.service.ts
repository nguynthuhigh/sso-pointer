import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { OtpService } from './otp.service';
import { VerifyUserDto } from '../dto/verify-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { App, ClientSecretModel } from '../schemas/app.schema';
import { newAppDto } from '../dto/new-app.dto';
import { randomBytes } from 'crypto';
@Injectable()
@UseFilters(HttpExceptionFilter)
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private otpService: OtpService,
    @InjectModel(App.name) private readonly appModel: Model<App>,
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
    if (!bcrypt.compare(signIn.password, foundUser.password)) {
      throw new BadRequestException('Email or password is wrong');
    }
    const tokens = await this.tokenService.signToken({
      id: foundUser._id.toString(),
      secretAccess: process.env.ACCESS_KEY,
      secretRefresh: process.env.REFRESH_KEY,
    });
    return tokens;
  }
  async newOauthApp(newOauthApp: newAppDto) {
    return await this.appModel.create({ ...newOauthApp });
  }
  async getOauthApps(id: string) {
    return await this.appModel
      .find({ userID: id })
      .select({ image: 1, applicationName: 1 })
      .lean()
      .exec();
  }
  async getOauthAppDetails(id: string) {
    return await this.appModel
      .findById(new Types.ObjectId(id))
      .populate({
        path: 'userID',
        select: 'name username email image',
      })
      .lean()
      .exec();
  }
  async generateClientSecret(clientId: string, id: string) {
    const app = await this.appModel.findById(new Types.ObjectId(clientId));
    if (!app) {
      throw new NotFoundException('App Not Found');
    }
    const clientSecret = randomBytes(12);
    const newClientSecret = new ClientSecretModel({
      clientSecret: clientSecret.toString('hex'),
      userID: new Types.ObjectId(id),
    });
    console.log(newClientSecret);
    const updatedApp = await app.updateOne({
      $push: { clientSecrets: newClientSecret },
    });
    if (updatedApp.modifiedCount === 0) {
      throw new BadRequestException('Fail Generate Client Secret');
    }
    return { message: 'Add new client secret success!' };
  }
}
