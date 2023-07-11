import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateGroupDto } from './dto/group.dto';
import { GroupService } from './group.service';

@ApiTags('Group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiResponse({ status: 201, type: CreateGroupDto })
  @Post('')
  createGroup(@Body() dto: CreateGroupDto): Promise<CreateGroupDto> {
    return this.groupService.createGroup(dto);
  }

  @Get('')
  getAllGroup() {
    return this.groupService.getAllGroup()
  }
}
