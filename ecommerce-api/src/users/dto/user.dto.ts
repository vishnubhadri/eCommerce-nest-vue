import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  user: {
    id: string;
    email: string;
    username: string;
  };
}
