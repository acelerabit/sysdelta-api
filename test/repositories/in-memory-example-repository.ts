import { ExamplesRepository } from 'src/application/repositories/example-repository';
import { Example } from './../../src/application/entities/example';

export class InMemoryExampleRepository implements ExamplesRepository {
  public example: Example[] = [];

  async create(example: Example) {
    this.example.push(example);
  }
}
