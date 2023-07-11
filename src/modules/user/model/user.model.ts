import {
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Group } from 'src/modules/group/model/group.model';
import { Queue } from 'src/modules/queue/model/queue.model';

@Table
export class User extends Model {
  @Column
  name: string;

  @Column(DataType.DATE)
  start_time: string;

  @Column(DataType.DATE)
  end_time: string;

  @Column
  position: number;

  @Column
  unique_key: string;

  @Default(false)
  @Column
  active: boolean;

  @ForeignKey(() => Group)
  group: Group;

  @ForeignKey(() => Queue)
  queue: Queue;
}
