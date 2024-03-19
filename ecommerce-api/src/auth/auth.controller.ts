import { Body, Controller, Post, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
  
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  
  async createUser(@Body() request:CreateUserDto){
    try {
      return await this.authService.createUser(request);
    } catch (error) {
      throw new HttpException(error.error, error.status);
    }
  }
}
