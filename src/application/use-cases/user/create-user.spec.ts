import { User } from './../../entities/user';
import { InMemoryUsersRepository } from './../../../../test/repositories/user/in-memory-user-repository';
import { CreateUser } from './create-user';

let inMemoryUsersRepository;
let createUser: CreateUser;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUser = new CreateUser(inMemoryUsersRepository);
  });

  it('should be able create a new user', async () => {
    const newUser = new User({
      name: 'user-test',
      email: 'email@test.com',
      password: '123',
      role: 'USER',
      createdAt: new Date(),
    });

    await createUser.execute(newUser);

    expect(inMemoryUsersRepository.users.length).toBe(1);
    expect(inMemoryUsersRepository.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: newUser.email,
        }),
      ]),
    );
  });
});
