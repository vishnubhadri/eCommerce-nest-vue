import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { UserInterests } from 'src/users/entities/user_interests.entity';

@Injectable()
export class TypeOrmConfiguration implements TypeOrmOptionsFactory {
  @Inject()
  configService: ConfigService;

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: this.configService.get<any>('DATABASE_TYPE'),
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_HOST_PORT'),
      username: this.configService.get<string>('DATABASE_USER'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_DB'),
      autoLoadEntities: true,
      entities: [Category, User, UserInterests],
      synchronize: true,
    };
  }
}
