import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from '../user/model/user.model';
import { Queue } from './model/queue.model';

@Injectable()
export class QueueService {
  constructor(
    @InjectModel(Queue) private readonly queueRespository: typeof Queue,
    @InjectModel(User) private readonly userRespository: typeof User,
  ) {}

  async createQueue(name: string, group): Promise<Queue> {
    console.log(group);
    return await this.queueRespository.create({ name, groupId: group });
  }

  async getAll(): Promise<Queue[]> {
    return await this.queueRespository.findAll({ include: [User] });
  }

  async getActiveUsers() {
    return await this.userRespository.findAll({
      where: { active: true },
      include: [Queue],
    });
  }

  async getNextUserByPosition(user: User): Promise<User> {
    return await this.userRespository.findOne({
      where: { position: { [Op.gt]: user.position }, active: true },
      limit: 1,
    });
  }

  async checkTimeActive() {
    const activeUsers = await this.getActiveUsers();
    var users;

    let options: {
      year: 'numeric';
      month: 'long';
      day: 'numeric';
    };
    const now = new Date();
    const nowDate = new Intl.DateTimeFormat('en-US', options).format(now);

    activeUsers.forEach(async (user) => {
      // if (nowDate == user.end_time) {
      console.log('Тут добавить функцию для создания уведомления');
      const nextUser = await this.getNextUserByPosition(user);
      console.log(
        '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------',
      );
      console.log(`User: ${user.name}, position: ${user.position}`);
      if (nextUser) {
        console.log(
          `Next User: ${nextUser.name}, position: ${nextUser.position}`,
        );
      } else {
        console.log('Next User not found');
      }
      ('------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
      // user.active = false;
      // }
    });

    return activeUsers;
  }
}
