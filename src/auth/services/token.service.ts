import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignTokenDto } from '../dto/sign-token.dto';
import { Token } from '../schemas/token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from '../../common/database/redis/redis.service';
@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
    private readonly redisService: RedisService,
  ) {}
  async signToken(
    signToken: SignTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign(
      { id: signToken.id },
      {
        secret: process.env.ACCESS_KEY,
        algorithm: 'HS256',
        expiresIn: '15m',
      },
    );
    const refreshToken = this.jwtService.sign(
      { id: signToken.id },
      {
        secret: process.env.REFRESH_KEY,
        algorithm: 'HS256',
        expiresIn: '15d',
      },
    );
    return { accessToken, refreshToken };
  }
  async updateToken(
    signToken: SignTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign(
      { id: signToken.id },
      { secret: signToken.secretAccess, expiresIn: '15m' },
    );
    const refreshToken = this.jwtService.sign(
      { id: signToken.id },
      { secret: signToken.secretRefresh, expiresIn: '15d' },
    );
    return { accessToken, refreshToken };
  }
  async signAccessTokenPair(
    id: string,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      id: id,
      email: email,
    };
    const getAccessToken = await this.redisService.getKey(id);
    if (getAccessToken) {
      return { accessToken: getAccessToken };
    }
    const accessToken = this.jwtService.sign(payload, {
      privateKey: process.env.SSO_PRIVATE_KEY,
    });
    await this.redisService.setKey(id, accessToken);
    return { accessToken };
  }
  async verifyToken(token: string, key: string) {
    console.log(key);
    try {
      const payload = this.jwtService.verify(token, {
        secret: key,
      });
      return payload;
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
  }
  async verifyTokenSSO(token: string, key: string) {
    try {
      const payload = this.jwtService.verify(token, {
        publicKey: key,
      });
      return payload;
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
