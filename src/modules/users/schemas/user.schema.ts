import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;
  @Prop()
  name: string;
  @Prop()
  username: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop()
  image: string;
  @Prop({ default: true })
  active: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);
