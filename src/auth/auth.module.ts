import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { OtpService } from './services/otp.service';
import { TokenService } from './services/token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { App, AppSchema } from './schemas/app.schema';
import { Otp, OtpSchema } from './schemas/otp.schema';
import { AuthMiddleware } from 'src/common/middlewares/auth.middleware';
import { Code, CodeSchema } from './schemas/code.schema';
import { Token, TokenSchema } from './schemas/token.schema';
import { RedisModule } from 'src/common/database/redis/redis.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: App.name, schema: AppSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: Code.name, schema: CodeSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    JwtModule.register({
      global: true,
      privateKey: process.env.SSO_PRIVATE_KEY,
      publicKey: process.env.SSO_PUBLIC_KEY,
      signOptions: { algorithm: 'RS256', expiresIn: '1h' },
    }),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, OtpService],
  exports: [AuthService, TokenService, OtpService],
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
        { path: '/auth/get-authorized-apps', method: RequestMethod.ALL },
      );
  }
}
