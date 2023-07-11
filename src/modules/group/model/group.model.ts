import { Column, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
import { Queue } from 'src/modules/queue/model/queue.model';
import { User } from 'src/modules/user/model/user.model';

@Table
export class Group extends Model {
  @Column
  name: string;

  @Column
  period: number;

  @Column
  seats: number;

  @HasMany(() => User)
  users: User[];

  @HasOne(() => Queue, 'group')
  queue: Queue;
}
