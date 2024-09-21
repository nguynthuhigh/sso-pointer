import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types, model } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export type AppDocument = HydratedDocument<App>;
@Schema({ timestamps: true })
export class ClientSecret extends Document {
  @Prop()
  clientSecret: string;
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userID: Types.ObjectId;
}
@Schema({ timestamps: true })
export class App extends Document {
  @Prop()
  image: string;
  @Prop({ required: true })
  applicationName: string;
  @Prop({ required: true })
  applicationDescription: string;
  @Prop()
  clientSecrets: ClientSecret[];
  @Prop({ required: true })
  homePageUrl: string;
  @Prop({ required: true })
  callBackUrl: string;
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userID: Types.ObjectId;
}
export const AppSchema = SchemaFactory.createForClass(App);
const ClientSecretSchema = SchemaFactory.createForClass(ClientSecret);
export const ClientSecretModel = model<ClientSecret>(
  'ClientSecret',
  ClientSecretSchema,
);
