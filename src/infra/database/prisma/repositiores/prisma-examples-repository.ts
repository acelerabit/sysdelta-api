import { Example } from './../../../../application/entities/example';
import { Injectable } from '@nestjs/common';
import { ExamplesRepository } from 'src/application/repositories/example-repository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaExamplesRepository implements ExamplesRepository {
  constructor(private prismaService: PrismaService) {}

  async create(example: Example): Promise<void> {
    await this.prismaService.example.create({
      data: {
        id: example.id,
        content: example.content,
        createdAt: example.createdAt,
      },
    });
  }
}
