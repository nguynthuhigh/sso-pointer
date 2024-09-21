import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignTokenDto } from '../dto/sign-token.dto';
import { ObjectId } from 'typeorm';
import { Token } from '../schemas/token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Crypto } from 'src/common/utils/crypto';
@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}
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
    const crypto = new Crypto();
    await this.tokenModel.create({
      accessToken: crypto.hashData(accessToken),
      refreshToken: crypto.hashData(refreshToken),
      userID: new Types.ObjectId(signToken.id),
    });
    return { accessToken, refreshToken };
  }
  async signAccessToken(
    id: ObjectId,
    secretAccess: string,
  ): Promise<{ accessToken: string }> {
    const accessToken = this.jwtService.sign(
      { id: id },
      { secret: secretAccess, expiresIn: '15m' },
    );
    //store
    const crypto = new Crypto();
    await this.tokenModel.create({
      accessToken: crypto.hashData(accessToken),
      userID: new Types.ObjectId(id),
    });
    return { accessToken };
  }
  async verifyToken(token: string, key: string): Promise<{ id: ObjectId }> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: key,
      });
      return { id: payload.id };
    } catch {
      const crypto = new Crypto();
      await this.tokenModel.deleteOne({
        $or: [
          { refreshToken: crypto.hashData(token) },
          { accessToken: crypto.hashData(token) },
        ],
      });
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
