import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './modules/users/users.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/services/auth.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { Otp, OtpSchema } from './auth/schemas/otp.schema';
import { App, AppSchema } from './auth/schemas/app.schema';
import { Code, CodeSchema } from './auth/schemas/code.schema';
import { Token, TokenSchema } from './auth/schemas/token.schema';
@Module({
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([
      { name: Otp.name, schema: OtpSchema },
      { name: App.name, schema: AppSchema },
      { name: Code.name, schema: CodeSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      //Template
      // defaults: {
      //   from: '"No Reply" <no-reply@localhost>',
      // },
      // preview: true,
      // template: {
      //   dir: process.cwd() + '/template/',
      //   adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController, UsersController, AuthController],
  providers: [
    AppService,
    AuthService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes

      // { path: '/auth/app-details', method: RequestMethod.ALL },
      // { path: '/auth/app-details', method: RequestMethod.ALL },
      // { path: '/auth/app-details', method: RequestMethod.ALL },
      // { path: '/auth/app-details', method: RequestMethod.ALL },
      // { path: '/auth/app-details', method: RequestMethod.ALL },
      ();
  }
}
