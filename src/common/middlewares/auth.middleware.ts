import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from 'src/auth/services/token.service';
import { UsersService } from 'src/modules/users/users.service';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const id = await this.tokenService.verifyToken(
      req.headers.authorization?.split(' ')[1],
      process.env.ACCESS_KEY,
    );
    const user = await this.usersService.getProfile(id.id);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    req['userID'] = id.id;
    console.log(req['userID']);
    console.log(id.id);
    req['user'] = user;
    next();
  }
}
