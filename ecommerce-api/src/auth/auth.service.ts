import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.authenticateUser({ email, password });
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, username: user.name, id: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async createUser(request: CreateUserDto): Promise<User | undefined> {
    return await this.usersService.createUser({
      email: request.email,
      name: request.name,
      password: request.password,
    });
  }
}
