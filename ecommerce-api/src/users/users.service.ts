import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as md5 from 'md5';
import * as uuid from 'uuid';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { AddInterestsDto } from './dto/add-interests.dto';
import { UserInterests } from './entities/user_interests.entity';
import { UserDto } from './dto/user.dto';
import { Category } from 'src/categories/entities/category.entity';
import { CategoryResponse } from 'src/categories/interface/categories';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private users: Repository<User>;

  @InjectRepository(Category)
  private category: Repository<Category>;

  @InjectRepository(UserInterests)
  private userInterests: Repository<UserInterests>;

  async findOne(email: string): Promise<User | undefined> {
    return this.users.findOne({ where: { email } });
  }

  async getUserById(userId: string): Promise<User | undefined> {
    return this.users.findOneOrFail({ where: { id: userId } });
  }

  async createUser(request: CreateUserDto): Promise<User | undefined> {
    const isAlreadyExists = await this.users.findOne({
      where: { email: request.email },
    });
    if (isAlreadyExists) {
      throw new ConflictException({
        error: `User ${request.email} already exists`,
      });
    }
    const user = this.users.create({
      id: uuid.v4(),
      email: request.email,
      password_hash: md5(request.password),
      name: request.name,
    });
    await this.users.insert(user);
    delete user.password_hash;
    return user;
  }

  async authenticateUser(
    request: AuthenticateUserDto,
  ): Promise<User | undefined> {
    const user = await this.users.findOne({
      where: { email: request.email, password_hash: md5(request.password) },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async addInterests(request: AddInterestsDto, user: UserDto) {
    try {
      await this.userInterests.manager.transaction(
        'REPEATABLE READ',
        async (manager) => {
          const curUser = await this.users.findOneOrFail({
            where: { id: user.user.id },
          });

          const interestPromises = [];
          for (const interest of request.interests) {
            interestPromises.push(
              manager.insert(UserInterests, {
                id: uuid.v4(),
                user: curUser,
                category_id: interest,
                user_id: user.user?.id,
                category: await this.category.findOneOrFail({
                  where: { id: interest },
                }),
              }),
            );
          }
          return await Promise.all(interestPromises);
        },
      );

      return { message: 'Interest(s) Mapped to the User' };
    } catch (err) {
      throw new ConflictException(err.message);
    }
  }

  async getInterests(user: UserDto): Promise<CategoryResponse[]> {
    const curUserInterests = await this.userInterests.findBy({
      user_id: user.user.id,
    });

    return await this.category
      .findBy({
        id: In(curUserInterests.map((c) => c.category_id)),
      })
      .then((category) =>
        category.map((c) => {
          return { name: c.name, id: c.id };
        }),
      );
  }
}
