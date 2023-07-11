import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from '../group/model/group.model';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './model/user.model';
import { QueueService } from '../queue/queue.service';
import { GroupService } from '../group/group.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)  private readonly userRepository: typeof User,
    @InjectModel(Group) private readonly groupRepository: typeof Group,
                        private readonly groupService: GroupService,
  ) {}

  async getUserByName(name: string) {
    return await this.userRepository.findOne({ where: { name } });
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    const validate = await this.getUserByName(dto.name)
    if (validate) {
      throw new BadRequestException('User with this name exist');
    }
    try {
      const group = await this.groupService.getGroupByName(dto.group)
      const newUser = await this.userRepository.create({
          ...dto,
          group: group.id,
        });
    }
   catch(e) {
    console.log(e)
    throw new BadRequestException('Bad request')
   }
    

    return dto;
  }

  async getAllUSers() {
    return this.userRepository.findAll({
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
    const user = await this.userRepository.update(dto, { where: { id } });
    return dto;
  }

  async deleteUser(id: string) {
    return this.userRepository.destroy({ where: { id } });
  }

  async getPosition() {
    return
  }
}
