import { IsNotEmpty } from 'class-validator';

export class AuthenticateUser {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
