import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { getTokenDto } from '../dto/get-token.dto';
import { requestAuthDto } from '../dto/request-auth.dto';
import { Code } from '../schemas/code.schema';
import { Token } from '../schemas/token.schema';
import { Authorized } from '../schemas/authorized.schema';
import { User } from 'src/modules/users/schemas/user.schema';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private otpService: OtpService,
    @InjectModel(App.name) private readonly appModel: Model<App>,
    @InjectModel(Code.name) private readonly codeModel: Model<Code>,
    @InjectModel(Authorized.name)
    private readonly authorizedModel: Model<Authorized>,
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
  async newOauthApp(newOauthApp: newAppDto) {
    return await this.appModel.create({ ...newOauthApp });
  }
  async getOauthApps(id: string) {
    return await this.appModel
      .find({ userID: new Types.ObjectId(id) })
      .select({ image: 1, applicationName: 1 })
      .lean()
      .exec();
  }
  async getOauthAppDetails(id: string) {
    const app = await this.appModel
      .findById(new Types.ObjectId(id))
      .populate({
        path: 'userID',
        select: 'name username email image ',
      })
      .lean()
      .exec();
    const totalUser = await this.authorizedModel.countDocuments({
      app: new Types.ObjectId(id),
    });
    return { ...app, totalUser: totalUser };
  }
  async OauthAppDetails(id: string) {
    const data = await this.appModel
      .findById(new Types.ObjectId(id))
      .select('applicationName applicationDescription callBackUrl image')
      .lean()
      .exec();
    return data;
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
    const updatedApp = await app.updateOne({
      $push: { clientSecrets: newClientSecret },
    });
    if (updatedApp.modifiedCount === 0) {
      throw new BadRequestException('Fail Generate Client Secret');
    }
    return { message: 'Add new client secret success!', data: newClientSecret };
  }
  async requestAuthorize(requestAuth: requestAuthDto) {
    const userId = new Types.ObjectId(requestAuth.id);
    const appId = new Types.ObjectId(requestAuth.clientId);
    const authorized = await this.authorizedModel.findOne({
      user: userId,
      app: appId,
    });
    const app = await this.appModel.findById(appId);
    if (!app) {
      throw new NotFoundException('App Not Found');
    }
    const code = randomBytes(12);
    const newCode = new this.codeModel({
      userID: userId,
      code: code.toString('hex'),
    });
    if (!authorized) {
      await this.authorizedModel.create({ user: userId, app: appId });
    }
    const addedCode = await newCode.save();
    return addedCode;
  }
  async getAccessToken(getAccessToken: getTokenDto) {
    const code = await this.codeModel
      .findOne({
        code: getAccessToken.code,
      })
      .populate({ path: 'userID', select: 'username email image' });
    if (!code) {
      throw new BadRequestException('Oops!, code not found');
    }
    const app = await this.appModel.findOne({
      _id: new Types.ObjectId(getAccessToken.clientId),
      'clientSecrets.clientSecret': getAccessToken.clientSecret,
    });
    if (!app) {
      throw new NotFoundException('Client id or client secret is wrong');
    }
    const token = await this.tokenService.signAccessToken(
      code.userID,
      process.env.ACCESS_KEY,
    );
    const deletedCode = await this.codeModel.deleteOne({
      code: getAccessToken.code,
    });
    if (deletedCode.deletedCount === 0) {
      throw new BadRequestException('Oops!, try again');
    }
    return { ...token, user: code.userID };
  }
  async getAuthorizedApps(id: string) {
    console.log(id);
    const data = await this.authorizedModel
      .find({
        user: new Types.ObjectId(id),
      })
      .populate({
        path: 'app',
        select: 'applicationName applicationDescription callBackUrl image',
      })
      .lean()
      .exec();
    console.log(data);
    return data;
  }
  async refreshToken(refreshToken: string, id: string) {
    await this.tokenService.verifyToken(refreshToken, process.env.REFRESH_KEY);
    const tokens = await this.tokenService.updateToken({
      id: id,
      secretAccess: process.env.ACCESS_KEY,
      secretRefresh: process.env.REFRESH_KEY,
      refreshToken: refreshToken,
    });
    return tokens;
  }
}
