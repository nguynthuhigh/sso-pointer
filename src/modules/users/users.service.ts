import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel({
      ...createUserDto,
      _id: new Types.ObjectId(),
    });
    return user.save();
  }
  async get() {
    const users = await this.userModel.find().lean().exec();
    return users;
  }
  async findOne(email: string) {
    return await this.userModel.findOne({ email: email }).lean().exec();
  }
}
