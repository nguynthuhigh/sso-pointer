import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { App } from './app.schema';
export type AuthorizedDocument = HydratedDocument<Authorized>;
@Schema({ timestamps: true })
export class Authorized extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true, ref: App.name })
  app: Types.ObjectId;
}
export const AuthorizedSchema = SchemaFactory.createForClass(Authorized);
