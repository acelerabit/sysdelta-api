import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/user-repository';
import { User } from './../../entities/user';

interface UserRequest {
  cityCouncilId: string;
}

interface UserResponse {
  users: User[];
}

@Injectable()
export class FetchUsersByCityCouncil {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ cityCouncilId }: UserRequest): Promise<UserResponse> {
    const users = await this.usersRepository.findManyByCityCouncil(
      cityCouncilId,
    );

    return { users };
  }
}
