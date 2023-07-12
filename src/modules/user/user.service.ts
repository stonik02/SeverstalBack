import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as uuid from 'uuid';
import { GroupService } from '../group/group.service';
import { Group } from '../group/model/group.model';
import { Queue } from '../queue/model/queue.model';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './model/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(Group) private readonly groupRepository: typeof Group,
    @InjectModel(Queue) private readonly queueRepository: typeof Queue,
    private readonly groupService: GroupService,
  ) {}

  async getUserByName(name: string) {
    return await this.userRepository.findOne({ where: { name: name } });
  }

  uniqueKey() {
    return uuid.v4();
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    const validate = await this.getUserByName(dto.name);
    if (validate) {
      throw new BadRequestException('User with this name exist');
    }
    try {
      const key = this.uniqueKey();
      const newUser = await this.userRepository.create({
        ...dto,
        unique_key: key,
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
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
    const user = await this.userRepository.update(dto, { where: { id } });
    return dto;
  }

  async deleteUser(id: string) {
    return this.userRepository.destroy({ where: { id } });
  }

  async getPosition(key): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { unique_key: key.key },
        include: [Group],
      });
      var maxPosition: number = await this.userRepository.max('position');
      console.log(maxPosition);
      if (!maxPosition) {
        user.position = 1;
      } else {
        user.position = maxPosition + 1;
        console.log(maxPosition + 1);
      }
      user.queueId = user.groupId;
      user.save();
      return user;
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException('Wrong data');
    }
  }

  async exitFromQueue(dto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { unique_key: dto.key },
    });
    user.position = null;
    user.queueId = null;
    user.save();
    return user;
  }

  async dateForUsers(user: User) {
    const now = new Date();
    const group = await this.groupRepository.findOne({
      where: { id: user.groupId },
    });
    console.log(`Группа ${user.groupId}`);
    let options: {
      year: 'numeric';
      month: 'long';
      day: 'numeric';
    };
    const start_time = new Intl.DateTimeFormat('en-US', options).format(now);
    now.setDate(now.getDate() + group.period);
    const end_time = new Intl.DateTimeFormat('en-US', options).format(now);
    user.start_time = start_time;
    user.end_time = end_time;
    user.save();
  }
}
