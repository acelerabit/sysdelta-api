import { PaginationParams } from '@/@shared/pagination-interface';
import { LegislativeMatter } from '../entities/legislative-matter';

export abstract class LegislativeMattersRepository {
  abstract create(legislativeMatter: LegislativeMatter): Promise<void>;
  abstract findAllDisassociated(
    cityCouncilId: string,
  ): Promise<LegislativeMatter[]>;

  abstract findAll(
    cityCouncilId: string,
    pagination: PaginationParams,
  ): Promise<LegislativeMatter[]>;
  abstract findAllWithoutPaginate(): Promise<LegislativeMatter[]>;
  abstract count(): Promise<number>;
  abstract findByCode(code: string): Promise<LegislativeMatter | null>;
  abstract fetchBySessionId(
    sessionId: string,
    pagination: PaginationParams,
    from?: string,
  ): Promise<LegislativeMatter[]>;
  abstract findById(id: string): Promise<LegislativeMatter | null>;
  abstract delete(id: string): Promise<void>;
  abstract update(legislativeMatter: LegislativeMatter): Promise<void>;
}
