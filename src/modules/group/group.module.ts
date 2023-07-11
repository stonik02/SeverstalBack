import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Group } from './model/group.model';

@Module({
  imports: [SequelizeModule.forFeature([Group])],
  providers: [GroupService],
  controllers: [GroupController],
  exports: [GroupModule],
})
export class GroupModule {}
