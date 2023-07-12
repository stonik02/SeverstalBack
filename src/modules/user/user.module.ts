import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupModule } from '../group/group.module';
import { Group } from '../group/model/group.model';
import { Queue } from '../queue/model/queue.model';
import { User } from './model/user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    SequelizeModule.forFeature([Group]),
    SequelizeModule.forFeature([Queue]),
    GroupModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserModule, UserService],
})
export class UserModule {}
