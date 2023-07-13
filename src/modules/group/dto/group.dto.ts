import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  period: number;

  @ApiProperty()
  @IsNumber()
  seats: number;
}

export class UpdateGroupDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  period: number;

  @ApiProperty()
  @IsNumber()
  seats: number;
}
