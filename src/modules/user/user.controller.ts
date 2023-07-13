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
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './model/user.model';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: 200 })
  @Post('addToQueue')
  addToQueue(@Body() key: string): Promise<User> {
    return this.userService.getPosition(key);
  }
  @Post('queueExit')
  exitFromQueue(@Body() key: string): Promise<User> {
    return this.userService.exitFromQueue(key);
  }

  @Post('me')
  getMe(@Body() key: string): Promise<User> {
    return this.userService.exitFromQueue(key);
  }

  // ------------------------------------------------------
  //                    ADMIN
  @ApiResponse({ status: 201, type: CreateUserDTO })
  @Post('')
  createUser(@Body() dto: CreateUserDTO): Promise<CreateUserDTO> {
    return this.userService.createUser(dto);
  }

  @ApiResponse({ status: 200, type: CreateUserDTO })
  @Get('')
  getUsers() {
    return this.userService.getAllUSers();
  }

  @ApiResponse({ status: 201, type: UpdateUserDTO })
  @Patch(':id')
  updateUser(@Param('id') id, @Body() dto: UpdateUserDTO) {
    return this.userService.updateUser(id, dto);
  }

  @ApiResponse({ status: 200 })
  @Delete(':id')
  deleteUser(@Param('id') id) {
    return this.userService.deleteUser(id);
  }
}
