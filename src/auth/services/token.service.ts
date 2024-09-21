import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignTokenDto } from '../dto/sign-token.dto';
import { ObjectId } from 'typeorm';
@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}
  async signToken(
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
    //save
    return { accessToken, refreshToken };
  }
  async verifyToken(token: string, key: string): Promise<{ id: ObjectId }> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: key,
      });
      return { id: payload.id };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
