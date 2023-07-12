import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Queue } from '../queue/model/queue.model';
import { QueueService } from '../queue/queue.service';
import { User } from '../user/model/user.model';
import { CreateGroupDto } from './dto/group.dto';
import { Group } from './model/group.model';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group) private readonly groupRepository: typeof Group,
    private readonly queueService: QueueService,
  ) {}

  async getGroupByName(name: string) {
    return await this.groupRepository.findOne({ where: { name } });
  }

  async createGroup(dto: CreateGroupDto): Promise<CreateGroupDto> {
    const validate = await this.getGroupByName(dto.name);
    if (validate) {
      throw new BadRequestException('Bad request');
    }
    const newGroup = await this.groupRepository.create({ ...dto });
    const newQueue = await this.queueService.createQueue(dto.name, newGroup.id);
    return dto;
  }

  async getAllGroup() {
    return await this.groupRepository.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [User, Queue],
    });
  }
}
