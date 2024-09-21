import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from './services/otp.service';
import { TokenService } from './services/token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpSchema } from './schemas/otp.schema';
@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: 'Otp', schema: OtpSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtService, OtpService],
  exports: [AuthService, TokenService, JwtService, OtpService],
})
export class AuthModule {}
