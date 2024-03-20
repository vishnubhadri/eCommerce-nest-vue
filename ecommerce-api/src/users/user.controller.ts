import {
  Controller,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
  Body,
  Request,
  Get,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { AddInterestsDto } from './dto/add-interests.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Put(`/interests`)
  async findAll(
    @Body() interests: AddInterestsDto,
    @Request() request: UserDto,
  ) {
    return await this.usersService.addInterests(interests, request);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get(`/interests`)
  async getInterests(@Request() request: UserDto) {
    return await this.usersService.getInterests(request);
  }
}
