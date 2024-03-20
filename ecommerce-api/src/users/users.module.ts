import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserInterests } from './entities/user_interests.entity';
import { User } from './entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User, UserInterests])],
  providers: [UsersService, AuthService],
  exports: [UsersService],
  controllers: [UserController],
})
export class UsersModule {}
