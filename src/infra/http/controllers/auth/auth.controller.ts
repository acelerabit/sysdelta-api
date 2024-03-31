import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { LoginUser } from 'src/application/use-cases/authenticate/login-user';
import { LoggingInterceptor } from 'src/infra/interceptors/logging.interceptor';
import { LoggingService } from 'src/infra/services/logging.service';
import { AuthenticateUserBody } from './dtos/authenticate-user-body';

const interceptor = new LoggingInterceptor(new LoggingService(), [
  'password',
  'access_token',
  'user.email',
]);

@Controller('auth')
export class AuthController {
  constructor(private loginUser: LoginUser) {}

  @UseInterceptors(interceptor)
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
