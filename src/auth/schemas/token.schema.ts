import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
export type TokenDocument = HydratedDocument<Token>;

@Schema({ timestamps: true })
export class Token extends Document {
  @Prop({ unique: true })
  accessToken: string;
  @Prop({ unique: true })
  refreshToken: string;
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userID: Types.ObjectId;
  @Prop({ index: true })
  sessionID: string;
}
export const TokenSchema = SchemaFactory.createForClass(Token);
