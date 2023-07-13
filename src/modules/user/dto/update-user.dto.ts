import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  active: boolean;

  @ApiProperty()
  @IsString()
  group: string;

  @ApiProperty()
  @IsNumber()
  position: number;

  @ApiProperty()
  @IsBoolean()
  is_superuser: boolean;
}
