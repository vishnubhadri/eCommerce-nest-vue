import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { UserInterests } from 'src/users/entities/user_interests.entity';
import { User } from 'src/users/entities/user.entity';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Category, User, UserInterests]),],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
