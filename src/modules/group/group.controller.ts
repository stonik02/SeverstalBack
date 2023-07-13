import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
import { GroupService } from './group.service';
import { Group } from './model/group.model';

@ApiTags('Group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  //--------------------------------------------------------------------
  //                      ADMIN

  @ApiResponse({ status: 201, type: CreateGroupDto })
  @Post('')
  createGroup(@Body() dto: CreateGroupDto): Promise<CreateGroupDto> {
    return this.groupService.createGroup(dto);
  }

  @ApiResponse({ status: 201, type: Group })
  @Get('')
  getAllGroup() {
    return this.groupService.getAllGroup();
  }

  @ApiResponse({ status: 201, type: UpdateGroupDto })
  @Patch(':id')
  updateGroup(@Param('id') id, @Body() dto: UpdateGroupDto) {
    return this.groupService.updateGroup(id, dto);
  }

  @Delete(':id')
  deleteGroup(@Param('id') id) {
    return this.groupService.deleteGroup(id);
  }
}
