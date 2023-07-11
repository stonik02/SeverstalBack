import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from '../group/model/group.model';
import { User } from './model/user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    SequelizeModule.forFeature([Group]),
    GroupModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
