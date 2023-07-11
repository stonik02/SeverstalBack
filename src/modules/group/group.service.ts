import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/group.dto';

@Injectable()
export class GroupService {
  createGroup(dto: CreateGroupDto): Promise<CreateGroupDto> {
    throw new Error('Method not implemented.');
  }
}
