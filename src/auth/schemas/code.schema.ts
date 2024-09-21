import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export type CodeDocument = HydratedDocument<Code>;

@Schema({ timestamps: true })
export class Code extends Document {
  @Prop({ required: true })
  code: string;
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userID: Types.ObjectId;
  @Prop({
    default: Date.now,
    expires: 300,
    type: Date,
  })
  expiresAt: Date;
}
export const CodeSchema = SchemaFactory.createForClass(Code);
