import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as md5 from 'md5';
import * as uuid from 'uuid';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private users: Repository<User>;

  async findOne(email: string): Promise<User | undefined> {
    return this.users.findOne({ where: { email } });
  }

  async createUser(request: CreateUserDto): Promise<User | undefined> {
    const isAlreadyExists = await this.users.findOne({ where: { email:request.email } });
    if(isAlreadyExists){
      throw new ConflictException({error:`User ${request.email} already exists`});
    }
    const user = this.users.create({
      id: uuid.v4(),
      email: request.email,
      password_hash: md5(request.password),
      name: request.name,
    });
    await this.users.insert(user);
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
}
