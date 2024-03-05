import { CreateUser } from './../user/create-user';
import { LoginUser } from './login-user';
import { User } from './../../entities/user';
import { InMemoryUsersRepository } from './../../../../test/repositories/user/in-memory-user-repository';
import { JwtService } from '@nestjs/jwt';

let inMemoryUsersRepository;
let loginUser: LoginUser;
let jwt: JwtService;
let createUser: CreateUser;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    jwt = new JwtService();
    loginUser = new LoginUser(inMemoryUsersRepository, jwt);
    createUser = new CreateUser(inMemoryUsersRepository);
  });

  it('should be able login with existent user', async () => {
    const newUser = new User({
      name: 'user-test',
      email: 'email@test.com',
      password: '123',
      role: 'USER',
      createdAt: new Date(),
    });

    await createUser.execute(newUser);

    const { accessToken } = await loginUser.execute({
      email: 'email@test.com',
      password: '123',
    });

    expect(accessToken).not.toBeFalsy();
  });
});
