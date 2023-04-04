import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { Model } from 'mongoose';
import { UserRequestDto } from './dto/users.request.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async signUp(body: UserRequestDto) {
    const { email, name, password } = body;
    const isUserExist = await this.userModel.exists({ email });

    if (isUserExist) {
      throw new UnauthorizedException('해당하는 아이디가 이미 존재합니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      email,
      name,
      password: hashedPassword,
    });

    return user.readOnlyData; //schema에서 virtual필드를 만들어서 사용가능
  }
}
