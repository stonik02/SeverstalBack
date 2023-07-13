import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNumber()
  groupId: number;

  @ApiProperty()
  @IsString()
  position: string;

  @ApiProperty()
  @IsBoolean()
  is_superuser?: boolean | null;
}
