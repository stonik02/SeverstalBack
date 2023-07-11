import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GroupService } from '../group/group.service';
import { Group } from '../group/model/group.model';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './model/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(Group) private readonly groupRepository: typeof Group,
    private readonly groupService: GroupService,
  ) {}

  async getUserByName(name: string) {
    return await this.userRepository.findOne({ where: { name } });
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    const validate = await this.getUserByName(dto.name);
    if (validate) {
      throw new BadRequestException('User with this name exist');
    }
    try {
      const newPosition = await this.getPosition(); // Это убрать впоследствии и заменить отдельной функцией если чел захочет встать в очередь
      const group = await this.groupService.getGroupByName(dto.group);
      const newUser = await this.userRepository.create({
        ...dto,
        group: group.id,
        position: newPosition,
      });
      this.dateForUsers(newUser);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Bad request');
    }

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

  async getPosition(): Promise<number> {
    const user = await this.userRepository.findOne({
      order: [['position', 'DESC']],
    });
    if (!user) {
      return 1;
    }
    console.log(user.position);
    return user.position + 1;
  }

  async dateForUsers(user: User) {
    const now = new Date();
    const group = await this.groupRepository.findOne({
      where: { id: user.group },
    });
    let options: {
      year: 'numeric';
      month: 'long';
      day: 'numeric';
    };

    const start_time = new Intl.DateTimeFormat('en-US', options).format(now);
    now.setDate(now.getDate() + group.period);
    const end_time = new Intl.DateTimeFormat('en-US', options).format(now);
    console.log(start_time);
    console.log(end_time);
    user.start_time = start_time;
    user.end_time = end_time;
    user.save();
  }
}
