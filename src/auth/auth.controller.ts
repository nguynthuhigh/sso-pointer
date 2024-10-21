import { Body, Controller, Get, Post, Req, UseFilters } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { Request } from 'express';
import { getTokenDto } from './dto/get-token.dto';
@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('sign-up')
  async signUp(@Body() body: CreateUserDto): Promise<any> {
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
  @Post('refresh-token')
  async refreshToken(@Body() body: string, @Req() req: Request) {
    const refreshToken = body; //get from cookie
    return await this.authService.refreshToken(refreshToken, req['userID']);
  }
  @Post('authorize')
  async Authorize(@Req() req: Request) {
    const code = await this.authService.requestAuthorize(
      req['user']._id,
      req['user'].email,
    );
    return code;
  }
  @Post('access-token')
  async getAccessTokenSSO(@Body() body: getTokenDto) {
    const token = await this.authService.getAccessToken(body);
    return token;
  }
  @Post('verify-token')
  async verifyAccessTokenSSO(@Body() body: { accessToken: string }) {
    return await this.authService.verifyTokenSSO(body.accessToken);
  }
  // @Post('refresh_token')
  // async refreshTokenSSO(@Body() body: getTokenDto) {
  //   const token = await this.authService.getAccessToken(body);
  //   return token;
  // }
  @Get('test')
  async test() {}
}
