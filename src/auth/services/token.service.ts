import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignTokenDto } from '../dto/sign-token.dto';
// import { VerifyTokenDto } from './dto/verify-token.dto';

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
    return { accessToken, refreshToken };
  }
  //   async verifyToken(verifyToken: VerifyTokenDto) {

  //   }
}
