import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { App } from './app.schema';
export type TokenDocument = HydratedDocument<Token>;

@Schema({ timestamps: true })
export class Token extends Document {
  accessToken: string;
  refreshToken: string;
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userID: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: App.name })
  appID: Types.ObjectId;
  @Prop({ default: 'auth' })
  type: string;
}
export const TokenSchema = SchemaFactory.createForClass(Token);
