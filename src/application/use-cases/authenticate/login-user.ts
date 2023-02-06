import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from './../../../common/constants';
import { UsersRepository } from '../../repositories/user-repository';
import { User } from './../../entities/user';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

@Injectable()
export class LoginUser {
  constructor(
    private usersRepository: UsersRepository,
    private jwt: JwtService,
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const { email, password } = request;

    const user = await this.usersRepository.findByEmail(email);

    if (user) {
      const passwordMatch = await this.comparePasswords({
        password,
        hashedPassword: user.password,
      });

      if (!passwordMatch) {
        throw new BadRequestException('Usuário ou senha inválida!');
      }

      const token = await this.signToken({ id: user.id, email: user.email });

      if (!token) {
        throw new BadRequestException('Usuário ou senha inválida!');
      }

      delete user.password;

      return { accessToken: token, user };
    }

    throw new BadRequestException('Usuário ou senha inválida!');
  }

  async logout(res: Response) {
    return res.send({ message: 'Usuário deslogado com suceeso' });
  }

  async comparePasswords(credentials: {
    password: string;
    hashedPassword: string;
  }): Promise<boolean> {
    const { password, hashedPassword } = credentials;

    return await bcrypt.compare(password, hashedPassword);
  }

  async signToken(args: { id: string; email: string }) {
    const payload = args;

    return this.jwt.signAsync(payload, {
      secret: jwtSecret,
      expiresIn: '2 days',
    });
  }
}
