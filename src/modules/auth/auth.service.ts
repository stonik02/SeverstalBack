import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/model/user.model';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly userService: UserService,
  ) {}

  async auth(dto: AuthDto): Promise<User> {
    const user = await this.userService.getUserByName(dto.name);
    if (dto.unique_key == user.unique_key) {
      return user;
    } else {
      throw new BadRequestException('Wrong data');
    }
  }
}
