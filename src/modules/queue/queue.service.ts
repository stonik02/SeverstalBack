import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Queue } from './model/queue.model';
import { CreateQueueDto } from './dto/queue.dto';

@Injectable()
export class QueueService {
  constructor(
    @InjectModel(Queue) private readonly queueRespositoru: typeof Queue,
  ) {}

  async createQueue(name: string, group): Promise<Queue> {
    return await this.queueRespositoru.create({name, group: group})
  }
}
