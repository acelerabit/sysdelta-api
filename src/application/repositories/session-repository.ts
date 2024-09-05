import { PaginationParams } from '@/@shared/pagination-interface';
import { Session } from '../entities/session';

export abstract class SessionsRepository {
  abstract create(session: Session): Promise<void>;
  abstract findAll(pagination: PaginationParams): Promise<Session[]>;
  abstract fetchByCityCouncilId(
    cityCouncilId: string,
    pagination: PaginationParams,
  ): Promise<any[]>;
  abstract findAllWithoutPaginate(): Promise<Session[]>;
  abstract count(): Promise<number>;
  abstract findById(id: string): Promise<Session | null>;
  abstract findBySessionNumber(numberSession: number): Promise<Session | null>;
  abstract delete(id: string): Promise<void>;
  abstract update(session: Session): Promise<void>;
}
