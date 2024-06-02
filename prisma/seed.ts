import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.deleteMany();

  const passwordHash = await hash('123456', 1);
  await prisma.user.createMany({
    data: [
      {
        name: 'John doe',
        email: 'johndoe@gmail.com',
        password: passwordHash,
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: passwordHash,
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: passwordHash,
      },
    ],
  });
}

seed().then(() => {
  console.log('Database seeded!');
});
