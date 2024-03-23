import { Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { DEFAULT_PAGE_LIMIT } from '../configs/config';
import { CategoryPage } from './interface/category-page';

@Injectable()
export class CategoriesService {
  @InjectRepository(Category)
  private categories: Repository<Category>;

  async findAll(pageId: number): Promise<CategoryPage> {
    const [result, total] = await this.categories.findAndCount({
      select: { name: true, id: true },
      take: DEFAULT_PAGE_LIMIT,
      skip: DEFAULT_PAGE_LIMIT * pageId,
    });

    return {
      data: result,
      page: Number(pageId + 1),
      total_page: Math.round(total / DEFAULT_PAGE_LIMIT),
    };
  }
}
