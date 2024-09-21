import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { newAppDto } from './dto/new-app.dto';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { Request } from 'express';
import { Types } from 'mongoose';
@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('sign-up')
  async signUp(@Body() body: CreateUserDto): Promise<any> {
    console.log(body);
    const message = await this.authService.signUp(body);
    return message;
  }
  @Post('verify/sign-up')
  async verifySignUp(@Body() body: VerifyUserDto): Promise<any> {
    const message = await this.authService.verifySignUp(body);
    return message;
  }
  @Post('sign-in')
  async signIn(@Body() body: CreateUserDto) {
    const data = await this.authService.signIn(body);
    return data;
  }
  @Post('new-oauth-app')
  async newOauthApp(@Body() body: newAppDto, @Req() req: Request) {
    console.log({
      ...body,
      userID: new Types.ObjectId(req['userID']),
    });
    const msg = await this.authService.newOauthApp({
      ...body,
      userID: new Types.ObjectId(req['userID']),
    });
    return msg;
  }
  @Get('get-apps')
  async getApps(@Req() req: Request) {
    const msg = await this.authService.getOauthApps(req['userID']);
    return msg;
  }
  @Get('app-details/:id')
  async getAppDetails(@Param('id') id: string) {
    const msg = await this.authService.getOauthAppDetails(id);
    return msg;
  }
  @Post('generate-client-secret')
  async generateClientSecret(clientId: string) {
    const msg = await this.authService.getOauthAppDetails(clientId);
    return msg;
  }
  @Post('delete-oauth-app')
  async deleteOauthApp() {}
}
