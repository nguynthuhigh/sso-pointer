import { IsEmail } from 'class-validator';
export class SendOtpDto {
  @IsEmail()
  to: string;
  password: string;
}
