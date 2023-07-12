import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsString()
  unique_key: string;

  @ApiProperty()
  @IsString()
  name: string;
}
