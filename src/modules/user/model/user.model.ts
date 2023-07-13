import {
  BelongsTo,
  Column,
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

  @Column
  email: string;

  @Column
  start_time: string;

  @Column
  end_time: string;

  @Column
  position: number;

  @Column
  unique_key: string;

  @Default(false)
  @Column
  active: boolean;

  @Default(false)
  @Column
  is_superuser: boolean;

  @ForeignKey(() => Group)
  @Column
  groupId: number;

  @BelongsTo(() => Group)
  group: Group;

  @ForeignKey(() => Queue)
  @Column
  queueId: number;

  @BelongsTo(() => Queue)
  queue: Queue;
}
