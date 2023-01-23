import { Injectable } from '@nestjs/common';
import { Example } from '../entities/example';
import { ExamplesRepository } from '../repositories/example-repository';

interface ExampleRequest {
  content: string;
}

interface ExampleResponse {
  example: Example;
}

@Injectable()
export class CreateExample {
  constructor(private examplesRepository: ExamplesRepository) {}

  async execute(request: ExampleRequest): Promise<ExampleResponse> {
    const { content } = request;

    const example = new Example({
      content,
      createdAt: new Date(),
    });

    await this.examplesRepository.create(example);

    return { example };
  }
}
