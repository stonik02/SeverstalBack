import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from '../group/model/group.model';
import { User } from '../user/model/user.model';
import { Queue } from './model/queue.model';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Queue]),
    SequelizeModule.forFeature([User]),
    SequelizeModule.forFeature([Group]),
  ],
  providers: [QueueService],
  controllers: [QueueController],
  exports: [QueueModule, QueueService],
})
export class QueueModule {}
