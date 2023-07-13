import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Group } from '../group/model/group.model';
import { User } from '../user/model/user.model';
import { Queue } from './model/queue.model';

@Injectable()
export class QueueService {
  constructor(
    @InjectModel(Queue) private readonly queueRespository: typeof Queue,
    @InjectModel(User) private readonly userRespository: typeof User,
    @InjectModel(Group) private readonly groupRespository: typeof Group,
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
      order: [['position', 'ASC']],
      include: [Queue],
    });
  }

  async getNoActiveUsers() {
    return await this.userRespository.findAll({
      where: { active: false },
      include: [Queue],
    });
  }

  async getNextUserByPosition(user: User | null): Promise<User | null> {
    if (user === null) {
      const nextUser = await this.userRespository.findOne({
        where: { active: false },
        order: [['position', 'ASC']],
      });
      return nextUser;
    }
    // const nextUser = await this.userRespository.findOne({
    //   where: { position: { [Op.gt]: user.position }, active: false },
    //   order: [['position', 'ASC']],
    // });

    const nextUser = await this.userRespository.findOne({
      where: { position: { [Op.gt]: user.position }, active: false },
      order: [['position', 'ASC']],
    });

    return nextUser;
  }

  checkingDates(end_time: string): boolean {
    let options: {
      year: 'numeric';
      month: 'long';
      day: 'numeric';
    };
    const now = new Date();
    const nowDate = new Intl.DateTimeFormat('en-US', options).format(now);

    return nowDate == end_time ? true : false;
  }

  async checkTimeActive() {
    const activeUsers = await this.getActiveUsers();

    for (const user of activeUsers) {
      // if (this.checkingDates(user.end_time)) {

      console.log('Тут добавить функцию для создания уведомления');

      await this.activateUser(user);
      // }
    }

    return activeUsers;
  }

  async activateUser(user) {
    var nextUser = await this.getNextUserByPosition(user);
    if (!nextUser) {
      nextUser = await this.getNextUserByPosition(null);
    }
    user.active = false;
    nextUser.active = true;
    await user.save();
    await nextUser.save();
  }

  async getAllPeriods(groupId: number) {
    const users = await this.userRespository.findAll({
      where: { groupId, position: { [Op.not]: null } },
      order: [['position', 'ASC']],
    });

    const group = await this.groupRespository.findOne({
      where: { id: groupId },
    });
    const queueLength = users.length;

    let maxPositionActiveUser = 1;
    let userMaxPosition;
    for (const user2 of users) {
      if (user2.position > maxPositionActiveUser && user2.active) {
        maxPositionActiveUser = user2.position;
        userMaxPosition = user2;
      }
    }

    for (const user of users) {
      if (user.active) {
        const nextPeriod = this.getNextPeriodForActiveUser(
          user,
          userMaxPosition,
          queueLength,
          group.period,
          group.seats,
          users,
        );
      } else {
        const nextPeriod = this.getNextPeriodForNoActiveUser(
          user,
          userMaxPosition,
          queueLength,
          group.period,
          group.seats,
          users,
        );
      }
    }
  }

  getNextPeriodForActiveUser(
    user: User,
    activeUserMaxPosition: User,
    queueLength: number,
    period: number,
    seats: number,
    users: User[],
  ) {
    // Ищем неактивных впереди
    let countPersonFront = queueLength - activeUserMaxPosition.position;
    let countPersonBack = 0;
    for (const user2 of users) {
      // Ищем всех юзеров сзади нас
      if (user2.position < user.position) {
        countPersonBack += 1;
      }
    }
    // Если первый и последний юзеры в очереди активны
    if (users[queueLength - 1].active && users[0].active) {
      // Считаем сколько активных вначале
      let count = 0;
      for (const user3 of users) {
        if (user3.active) {
          count++;
        } else {
          break;
        }
      }
      // Отнимаем от юзеров сзади активных
      countPersonBack -= count;
    }
    countPersonFront += countPersonBack;
    // Если сзади нас нет неактивных
    if (countPersonFront == 0 || countPersonFront == -1) {
      countPersonFront = queueLength - user.position;
    }
    let countPeriodFront;
    if (countPersonFront % seats === 0) {
      countPeriodFront = countPersonFront / seats + 1;
    } else {
      countPeriodFront = Math.ceil(countPersonFront / seats);
    }
    console.log(`Активный Юзер: ${user.id},${user.id},${user.id},${user.id}`);
    console.log(`Кол-во людей впереди: ${countPersonFront}`);
    console.log(
      `Кол-во периодов впереди: ${countPeriodFront},${countPeriodFront},${countPeriodFront},${countPeriodFront},${countPeriodFront},${countPeriodFront}`,
    );
  }

  async getNextPeriodForNoActiveUser(
    user: User,
    activeUserMaxPosition: User,
    queueLength: number,
    period: number,
    seats: number,
    users: User[],
  ) {
    let countPeriodFront = 0;
    let countPersonFront = 0;
    let countPersonBack = 0;
    // Если сзади есть активный юзер
    if (activeUserMaxPosition.position < user.position) {
      console.log(
        `Не Активный Юзер: ${user.id},${user.id},${user.id},${user.id}`,
      );

      // Иначе
    } else {
      countPersonFront = queueLength - activeUserMaxPosition.position;
      countPersonBack = user.position - 1;
      countPersonFront += countPersonBack;
      console.log(
        `Не Активный Юзер: ${user.id},${user.id},${user.id},${user.id}`,
      );
    }
    let count = 0;
    if (users[queueLength - 1].active && users[0].active) {
      for (const user3 of users) {
        if (user3.active) {
          count++;
        } else {
          break;
        }
      }
      // countPersonFront - count;
    }
    countPersonFront - count;

    if (countPersonFront % seats === 0) {
      countPeriodFront = countPersonFront / seats + 1;
    } else {
      countPeriodFront = Math.ceil(countPersonFront / seats);
    }

    console.log(`Кол-во людей впереди: ${countPersonFront}`);
    console.log(
      `Кол-во периодов впереди: ${countPeriodFront},${countPeriodFront},${countPeriodFront},${countPeriodFront},${countPeriodFront}`,
    );
  }
}
