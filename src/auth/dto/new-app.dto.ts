import { Types } from 'mongoose';
export class newAppDto {
  applicationName: string;
  applicationDescription: string;
  homePageUrl: string;
  callBackUrl: string;
  userID: Types.ObjectId;
}
