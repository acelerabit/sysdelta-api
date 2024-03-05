import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { LoginUser } from 'src/application/use-cases/authenticate/login-user';
import { AuthenticateUserBody } from '../dtos/authenticate-user-body';

@Controller('auth')
export class AuthController {
  constructor(private loginUser: LoginUser) {}

  @Post('/login')
  async login(@Body() body: AuthenticateUserBody) {
    const { email, password } = body;

    const { accessToken, user } = await this.loginUser.execute({
      email,
      password,
    });

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }
}
