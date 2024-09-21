import { Types } from 'mongoose';

export class requestAuthDto {
  clientId: string;
  scope: string;
  id: Types.ObjectId;
  redirectUri: string;
}
