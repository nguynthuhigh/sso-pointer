import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { Token } from 'src/auth/schemas/token.schema';
import { TokenService } from 'src/auth/services/token.service';
import { UsersService } from 'src/modules/users/users.service';
import { Crypto } from '../utils/crypto';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
    @InjectModel(Token.name) private readonly tokenModal: Model<Token>,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const crypto = new Crypto();
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException('Unauthorized');
    }
    const token = await this.tokenModal
      .findOne({
        accessToken: crypto.hashData(accessToken),
      })
      .lean();
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    const id = await this.tokenService.verifyToken(
      accessToken,
      process.env.ACCESS_KEY,
    );

    const user = await this.usersService.getProfile(id.id);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    req['userID'] = id.id;
    req['user'] = user;
    next();
  }
}
