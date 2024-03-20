import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Query('page') pageId: number) {
    if (pageId === undefined) {
      throw new BadRequestException(`Invalid parameter 'page'`);
    }
    if (pageId < 1) {
      throw new BadRequestException(`Invalid page index`);
    }
    return await this.categoriesService.findAll(pageId - 1);
  }
}
