import { CityCouncil } from '@/application/entities/city-council';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryCityCouncilRepository } from 'test/repositories/city-council/in-memory-city-council-repository';
import { InMemoryUsersRepository } from './../../../../test/repositories/user/in-memory-user-repository';
import { User } from './../../entities/user';
import { CreateUser } from './create-user';

let inMemoryUsersRepository;
let inMemoryCityCouncilRepository;

let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

let createUser: CreateUser;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryCityCouncilRepository = new InMemoryCityCouncilRepository();
    fakeEncrypter = new FakeEncrypter();
    fakeHasher = new FakeHasher();
    const mockSendMailQueue = {
      add: vi.fn(),
    } as any;
    createUser = new CreateUser(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter,
      inMemoryCityCouncilRepository,
      mockSendMailQueue,
    );
  });

  it('should be able create a new user', async () => {
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

    await createUser.execute({
      cpf: '123',
      email: newUser.email,
      name: newUser.name,
      phone: '123',
      politicalParty: 'teste',
      role: 'ASSISTANT',
      cityCouncilId: cityCouncil.id,
      requestOwnerId: admin.id,
    });

    expect(inMemoryUsersRepository.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: newUser.email,
        }),
      ]),
    );
  });
});
