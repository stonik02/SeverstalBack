import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../user/model/user.model';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 201, type: User })
  //   @UseGuards(JWTAuthGuard)
  @Post('create')
  createCategory(@Body() dto: AuthDto): Promise<User> {
    return this.authService.auth(dto);
  }
}
