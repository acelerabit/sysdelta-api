import { PaginationParams } from '@/@shared/pagination-interface';
import { Office } from '../entities/office';

export abstract class OfficesRepository {
  abstract create(office: Office): Promise<void>;
  abstract count(): Promise<number>;
  abstract findById(id: string): Promise<Office | null>;
  abstract findBySessionId(sessionId: string): Promise<Office | null>;
  abstract fetchBySessionId(
    sessionId: string,
    pagination: PaginationParams,
  ): Promise<Office[]>;
  abstract delete(id: string): Promise<void>;
  abstract update(office: Office): Promise<void>;
}
