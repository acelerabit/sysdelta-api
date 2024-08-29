import { PaginationParams } from '@/@shared/pagination-interface';
import { User } from '../entities/user';

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;
  abstract findAll(pagination: PaginationParams): Promise<User[]>;
  abstract findManyAdmin(pagination: PaginationParams): Promise<User[]>;
  abstract findAllByCityCouncil(cityCouncilId: string): Promise<User[]>;
  abstract findManyByCityCouncil(props: {
    cityCouncilId: string;
    pagination: PaginationParams;
    name?: string;
    email?: string;
    orderByField?: 'name' | 'email' | 'createdAt' | 'role';
    orderDirection?: 'desc' | 'asc';
    filterParams?: {
      role: 'ADMIN' | 'PRESIDENT' | 'SECRETARY' | 'COUNCILOR' | 'ASSISTANT';
      startDate: Date;
      endDate: Date;
    };
  }): Promise<User[]>;
  abstract findAllWithoutPaginate(): Promise<User[]>;
  abstract count(): Promise<number>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByCpf(cpf: string): Promise<User | null>;
  abstract findByPhone(phone: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract update(user: User): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
