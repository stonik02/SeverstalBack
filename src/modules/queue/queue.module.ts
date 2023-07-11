import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Queue } from './model/queue.model';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';

@Module({
  imports: [SequelizeModule.forFeature([Queue])],
  providers: [QueueService],
  controllers: [QueueController],
  exports: [QueueModule, QueueService],
})
export class QueueModule {}
