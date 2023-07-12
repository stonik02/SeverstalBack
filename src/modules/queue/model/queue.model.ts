import {
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Group } from 'src/modules/group/model/group.model';
import { User } from 'src/modules/user/model/user.model';

@Table
export class Queue extends Model {
  @Column
  name: string;

  @HasMany(() => User)
  users: User[];

  @ForeignKey(() => Group)
  @Column({ field: 'groupId' })
  groupId: number;
}
