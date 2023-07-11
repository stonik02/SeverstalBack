import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  active: boolean;

  @ApiProperty()
  @IsString()
  group: string;

  @ApiProperty()
  @IsNumber()
  position: number;
}
