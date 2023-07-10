import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './model/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  getUserByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    const newUser = this.userRepository.create({ ...dto });
    return newUser;
  }

  async getAllUSers() {
    return this.userRepository.findAll({
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
    const user = await this.userRepository.update(dto, { where: { id } });
    return dto;
  }

  async deleteUser(id: string) {
    return this.userRepository.destroy({ where: { id } });
  }
}
