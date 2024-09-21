import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export type UserDocument = HydratedDocument<App>;

@Schema({ timestamps: true })
export class App extends Document {
  @Prop()
  image: string;
  @Prop({ required: true })
  applicationName: string;
  @Prop({ required: true })
  applicationDescription: string;
  @Prop()
  clientSecret: string[];
  @Prop({ required: true })
  homePageUrl: string;
  @Prop({ required: true })
  callBackUrl: string;
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userID: Types.ObjectId;
}
export const AppSchema = SchemaFactory.createForClass(App);
