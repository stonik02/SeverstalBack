import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from '../group/model/group.model';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './model/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(Group) private readonly groupRepository: typeof Group,
  ) {}

  getUserByName(name: string) {
    return this.userRepository.findOne({ where: { name } });
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    if (this.getUserByName(dto.name)) {
      throw new BadRequestException('User with this name exist');
    }
    const group = this.groupRepository.findOne({ where: { name: dto.group } });
    const newUser = this.userRepository.create({
      name: dto.name,
      group: group,
    });

    return dto;
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
