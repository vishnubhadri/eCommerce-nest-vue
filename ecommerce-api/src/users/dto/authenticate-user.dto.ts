import { IsNotEmpty, IsEmail } from 'class-validator';

export class AuthenticateUserDto {
  @IsNotEmpty({ message: 'Please enter a email address' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Please enter a password' })
  password: string;
}
