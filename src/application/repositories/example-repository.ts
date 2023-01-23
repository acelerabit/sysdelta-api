import { Example } from './../entities/example';

export abstract class ExamplesRepository {
  abstract create(example: Example): Promise<void>;
}
