import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type UserDocument = HydratedDocument<Sso>;

@Schema()
export class Sso extends Document {
  @Prop({ required: true })
  applicationName: string;
  @Prop({ required: true })
  clientId: string;
  @Prop({ required: true })
  clientSecret: string;
  expiresAt: Date;
}
export const SsoSchema = SchemaFactory.createForClass(Sso);
