import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({ timestamps: true })
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
