import { BadRequestException, Injectable, UseFilters } from '@nestjs/common';
import { SendOtpDto } from '../dto/send-otp.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Otp } from '../schemas/otp.schema';
import { Model } from 'mongoose';
import { GenerateOTP } from 'src/common/utils/generate-otp';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
@UseFilters(HttpExceptionFilter)
@Injectable()
export class OtpService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
  ) {}
  async sendOTP(sendOTP: SendOtpDto): Promise<any> {
    const otpGenerator = new GenerateOTP();
    const otp = otpGenerator.generator(6);
    console.log(otp);
    const OtpHash = await bcrypt.hash(otp, 10);
    await this.otpModel.create({
      email: sendOTP.to,
      password: sendOTP.password,
      otp: OtpHash,
    });
    await this.mailerService.sendMail({
      to: sendOTP.to,
      from: 'presspay.mail@gmail.com',
      subject: '[Pointer] - Your OTP',
      text: otp,
    });
  }
  async verifyOTP(verifyOtpDto: VerifyOtpDto) {
    const otpData = await this.otpModel.findOne({ email: verifyOtpDto.email });
    if (!otpData) {
      throw new BadRequestException('OTP has expired');
    }
    if (!bcrypt.compare(verifyOtpDto.otp, otpData.otp)) {
      throw new BadRequestException('OTP has expired');
    }
    return otpData;
  }
}
