import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type UserDocument = HydratedDocument<Otp>;

@Schema()
export class Otp extends Document {
  @Prop({ required: true, index: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  otp: string;
  @Prop({
    default: () => new Date(Date.now()),
    expires: 300,
    type: Date,
  })
  expiresAt: Date;
}
export const OtpSchema = SchemaFactory.createForClass(Otp);
