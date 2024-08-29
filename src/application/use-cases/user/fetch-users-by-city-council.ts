import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/user-repository';
import { User } from './../../entities/user';
import { PaginationParams } from '@/@shared/pagination-interface';

interface UserRequest {
  cityCouncilId: string;
  email?: string;
  name?: string;
  orderByField?: 'name' | 'email' | 'createdAt';
  orderDirection?: 'desc' | 'asc';
  filterParams?: {
    role: 'ADMIN' | 'PRESIDENT' | 'SECRETARY' | 'COUNCILOR' | 'ASSISTANT';
    startDate: Date;
    endDate: Date;
  };
  pagination?: PaginationParams;
}

interface UserResponse {
  users: User[];
}

@Injectable()
export class FetchUsersByCityCouncil {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    cityCouncilId,
    pagination,
    name,
    email,
    orderByField,
    orderDirection,
    filterParams,
  }: UserRequest): Promise<UserResponse> {
    const users = await this.usersRepository.findManyByCityCouncil({
      cityCouncilId,
      pagination,
      name,
      email,
      orderByField,
      orderDirection,
      filterParams,
    });

    return { users };
  }
}
