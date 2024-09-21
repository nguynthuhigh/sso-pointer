import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
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
import { Code, CodeSchema } from './schemas/code.schema';
import { Token, TokenSchema } from './schemas/token.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: App.name, schema: AppSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: Code.name, schema: CodeSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtService, OtpService],
  exports: [AuthService, TokenService, JwtService, OtpService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/auth/generate-client-secret', method: RequestMethod.ALL },
        { path: '/auth/get-apps', method: RequestMethod.ALL },
        { path: '/auth/app-details', method: RequestMethod.ALL },
        { path: '/auth/new-oauth-app', method: RequestMethod.ALL },
        { path: '/auth/authorize', method: RequestMethod.ALL },
      );
  }
}
