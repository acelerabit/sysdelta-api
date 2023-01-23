import { CreateExample } from './../../../application/use-cases/create-example';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateExampleBody } from '../dtos/create-example-body';

@Controller('examples')
export class ExamplesController {
  constructor(private createExample: CreateExample) {}

  @Post()
  async create(@Body() body: CreateExampleBody) {
    const { content } = body;

    const { example } = await this.createExample.execute({
      content,
    });

    return { example };
  }
}
