import * as crypto from 'crypto';
export class Crypto {
  hashData(data: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  }
}
