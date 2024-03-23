import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginResponse } from './interface/login';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<LoginResponse> {
    const user = await this.usersService.authenticateUser({ email, password });
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      access_token: this._generateJWT(user.email, user.name, user.id),
      email: user.email,
      username: user.name,
      id: user.id,
    };
  }

  async createUser(request: CreateUserDto): Promise<LoginResponse | undefined> {
    const user: User = await this.usersService.createUser({
      email: request.email,
      name: request.name,
      password: request.password,
    });
    return {
      access_token: this._generateJWT(user.email, user.name, user.id),
      email: user.email,
      username: user.name,
      id: user.id,
    };
  }

  async verify(token: string) {
    return this.jwtService.verify(token);
  }

  _generateJWT(email: string, username: string, id: string): string {
    const payload = { email: email, username: username, id: id };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
  }
}
