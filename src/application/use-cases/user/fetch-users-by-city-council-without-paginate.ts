import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/user-repository';
import { User } from './../../entities/user';
import { PaginationParams } from '@/@shared/pagination-interface';

interface UserRequest {
  cityCouncilId: string;
}

interface UserResponse {
  users: User[];
}

@Injectable()
export class FetchUsersByCityCouncilWithoutPaginate {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ cityCouncilId }: UserRequest): Promise<UserResponse> {
    const users = await this.usersRepository.findAllByCityCouncil(
      cityCouncilId,
    );

    return { users };
  }
}
