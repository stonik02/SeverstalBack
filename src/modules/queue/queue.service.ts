import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Queue } from './model/queue.model';

@Injectable()
export class QueueService {
  constructor(
    @InjectModel(Queue) private readonly userRepository: typeof Queue,
  ) {}
}
