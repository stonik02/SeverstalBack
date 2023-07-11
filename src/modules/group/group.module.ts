import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Group } from './model/group.model';
import { UserModule } from '../user/user.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [SequelizeModule.forFeature([Group]), QueueModule],
  providers: [GroupService],
  controllers: [GroupController],
  exports: [GroupModule, GroupService],
})
export class GroupModule {}
