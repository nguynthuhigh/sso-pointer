import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from './services/otp.service';
import { TokenService } from './services/token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { App, AppSchema } from './schemas/app.schema';
import { Otp, OtpSchema } from './schemas/otp.schema';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: App.name, schema: AppSchema }]),
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtService, OtpService],
  exports: [AuthService, TokenService, JwtService, OtpService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AuthController);
  }
}
