import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/user-repository';
import { User } from './../../entities/user';
import { PaginationParams } from '@/@shared/pagination-interface';

interface UserRequest {
  pagination: PaginationParams;
}

interface UserResponse {
  users: User[];
}

@Injectable()
export class FetchUsersAdmin {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ pagination }: UserRequest): Promise<UserResponse> {
    const users = await this.usersRepository.findManyAdmin(pagination);

    return { users };
  }
}
