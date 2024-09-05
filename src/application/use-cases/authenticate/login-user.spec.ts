import { JwtService } from '@nestjs/jwt';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { vi } from 'vitest';
import { InMemoryUsersRepository } from './../../../../test/repositories/user/in-memory-user-repository';
import { User } from './../../entities/user';
import { CreateUser } from './../user/create-user';
import { LoginUser } from './login-user';
import { randomUUID } from 'crypto';
import { CityCouncil } from '@/application/entities/city-council';
import { InMemoryCityCouncilRepository } from 'test/repositories/city-council/in-memory-city-council-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryCityCouncilRepository;
let loginUser: LoginUser;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let jwt: JwtService;
let createUser: CreateUser;

describe('Authenticate User', () => {
  const mockJwt = vi.fn().mockImplementation(() => {
    return {
      signAsync: vi.fn().mockResolvedValue('sdskdlksd'),
    };
  });

  const mockHash = vi.fn().mockImplementation(() => {
    return {
      hash: vi.fn().mockResolvedValue('123-hashed'),
      compare: vi.fn().mockResolvedValue(true),
    };
  });

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryCityCouncilRepository = new InMemoryCityCouncilRepository();
    fakeHasher = mockHash();
    fakeEncrypter = new FakeEncrypter();
    jwt = mockJwt();

    const mockSendMailQueue = {
      add: vi.fn(),
    } as any;

    loginUser = new LoginUser(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter,
      jwt,
    );
    createUser = new CreateUser(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter,
      inMemoryCityCouncilRepository,
      mockSendMailQueue,
    );
  });

  it('should be able login with existent user', async () => {
    const cityCouncil = CityCouncil.create({
      city: 'city-test',
      cnpj: '123',
      name: 'city test',
      state: 'state test',
    });

    inMemoryCityCouncilRepository.cityCouncils.push(cityCouncil);

    const admin = User.create({
      name: 'admin-test',
      email: 'admin@test.com',
      password: '123',
      role: 'ADMIN',
      createdAt: new Date(),
    });

    inMemoryUsersRepository.users.push(admin);

    const newUser = User.create({
      name: 'user-test',
      email: 'email@test.com',
      password: '123',
      role: 'ASSISTANT',
      createdAt: new Date(),
    });

    const userResponse = await createUser.execute({
      cpf: '123',
      email: newUser.email,
      name: newUser.name,
      phone: '123',
      politicalParty: 'teste',
      role: 'ASSISTANT',
      cityCouncilId: cityCouncil.id,
      requestOwnerId: admin.id,
    });

    const { accessToken } = await loginUser.execute({
      email: 'email@test.com',
      password: '123',
    });

    expect(accessToken).not.toBeFalsy();
  });
});
