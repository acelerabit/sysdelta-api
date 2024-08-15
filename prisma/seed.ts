import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import 'dotenv/config';
const prisma = new PrismaClient();

async function seed() {
  await prisma.user.deleteMany();

  const passwordHash = await hash(process.env.ROOT_SEED_PASSWORD, 8);

  await prisma.user.create({
    data: {
      name: 'John doe',
      email: 'root@gmail.com',
      password: passwordHash,
      role: 'ADMIN',
    },
  });
}

seed().then(() => {
  console.log('Database seeded!');
});
