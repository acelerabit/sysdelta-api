import { PaginationParams } from '@/@shared/pagination-interface';
import { User } from './../../../src/application/entities/user';
import { UsersRepository } from 'src/application/repositories/user-repository';

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = [];

  async create(user: User) {
    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email);
  }

  async findById(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findAll(pagination: PaginationParams): Promise<User[]> {
    return this.users
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(
        (pagination.page - 1) * pagination.itemsPerPage,
        pagination.page * pagination.itemsPerPage,
      );
  }

  async update(user: User): Promise<void> {
    const userFound = this.users.findIndex(
      (userItem) => userItem.email === user.email,
    );

    this.users[userFound] = user;

    return;
  }

  async findAllWithoutPaginate(): Promise<User[]> {
    return this.users;
  }

  async count(): Promise<number> {
    return this.users.length;
  }

  async findManyAdmin(pagination: PaginationParams): Promise<User[]> {
    const { page, itemsPerPage } = pagination;
    const admins = this.users.filter((user) => user.role === 'ADMIN');
    const startIndex = (page - 1) * itemsPerPage;
    return admins.slice(startIndex, startIndex + itemsPerPage);
  }

  async findAllByCityCouncil(cityCouncilId: string): Promise<User[]> {
    return this.users.filter(
      (user) => user.affiliatedCouncilId === cityCouncilId,
    );
  }

  async findManyByCityCouncil(props: {
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
  }): Promise<User[]> {
    let users = this.users.filter(
      (user) => user.affiliatedCouncilId === props.cityCouncilId,
    );

    if (props.name) {
      users = users.filter((user) => user.name.includes(props.name));
    }

    if (props.email) {
      users = users.filter((user) => user.email.includes(props.email));
    }

    if (props.filterParams) {
      const { role, startDate, endDate } = props.filterParams;
      users = users.filter(
        (user) =>
          user.role === role &&
          user.createdAt >= startDate &&
          user.createdAt <= endDate,
      );
    }

    if (props.orderByField) {
      users.sort((a, b) => {
        const fieldA = a[props.orderByField!] as string | Date;
        const fieldB = b[props.orderByField!] as string | Date;

        if (fieldA < fieldB) {
          return props.orderDirection === 'asc' ? -1 : 1;
        }
        if (fieldA > fieldB) {
          return props.orderDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    const { page, itemsPerPage } = props.pagination;
    const startIndex = (page - 1) * itemsPerPage;
    return users.slice(startIndex, startIndex + itemsPerPage);
  }

  async findByCpf(cpf: string): Promise<User | null> {
    return this.users.find((user) => user.cpf === cpf) || null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.users.find((user) => user.phone === phone) || null;
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }

  async inactivate(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);
    if (user) {
      user.active = false;
    }
    return user || null;
  }

  async activate(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);
    if (user) {
      user.active = true;
    }
    return user || null;
  }
}
