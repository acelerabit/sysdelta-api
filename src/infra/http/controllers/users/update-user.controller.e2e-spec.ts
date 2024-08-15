import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';

import request from 'supertest';

describe('Update user (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[PUT] / users', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: await hash('1234', 8),
        role: 'ASSISTANT',
      },
    });

    const response = await request(app.getHttpServer()).put('/users').send({
      email: 'johndoe-updated@gmail.com',
      role: 'PRESIDENT',
      id: user.id,
    });

    expect(response.statusCode).toBe(200);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'johndoe-updated@gmail.com',
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
