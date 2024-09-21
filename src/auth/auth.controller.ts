import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';

@Controller('auth')
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
  // @Post('mailer')
  // async Mailer() {
  //   await this.mailerService.sendMail({
  //     to: 'minhnguyen11a1cmg@gmail.com',
  //     from: 'presspay.mail@gmail.com',
  //     subject: 'Testing Nest Mailermodule with template ✔',
  //     template: 'welcome',
  //   });
  // }
}
