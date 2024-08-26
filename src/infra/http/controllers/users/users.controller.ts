import { FetchUsersAdmin } from './../../../../application/use-cases/user/fetch-admin-users';
import { FetchUsers } from '@/application/use-cases/user/fetch-users';
import { GetUser } from '@/application/use-cases/user/get-user';
import { GetUserByEmail } from '@/application/use-cases/user/get-user-by-email';
import { UpdateUser } from '@/application/use-cases/user/update-user';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { CreateUser } from 'src/application/use-cases/user/create-user';
import { CreateUserBody } from './dtos/create-user-body';
import { GetUserByEmailBody } from './dtos/get-user-by-email';
import { UpdateUserBody } from './dtos/update-user-body';
import { UsersPresenters } from './presenters/user.presenter';
import { Auth } from '@/infra/decorators/auth.decorator';
import { Role } from '@prisma/client';
import { FetchUsersByCityCouncil } from '@/application/use-cases/user/fetch-users-by-city-council';
import { CreateUserAdminBody } from './dtos/create-user-admin-body';
import { CreateUserAdmin } from '@/application/use-cases/user/create-user-admin';

@Controller('users')
export class UsersController {
  constructor(
    private createUser: CreateUser,
    private createUserAdmin: CreateUserAdmin,
    private getUser: GetUser,
    private getUserByEmail: GetUserByEmail,
    private updateUser: UpdateUser,
    private fetchUsers: FetchUsers,
    private fetchUsersAdmin: FetchUsersAdmin,
    private fetchUsersByCityCouncil: FetchUsersByCityCouncil,
  ) {}

  // @UseInterceptors(interceptor)
  @Post()
  async create(@Body() body: CreateUserBody, @Req() req: any) {
    const { email, role, name, cityCouncilId, phone, cpf, politicalParty } =
      body;

    const { user } = await this.createUser.execute({
      requestOwnerId: req.userId,
      name,
      email,
      role,
      cityCouncilId: cityCouncilId,
      phone,
      cpf,
      politicalParty,
    });

    return {
      email: user.email,
      name: user.name,
      role: user.role,
      id: user.id,
    };
  }

  @Auth(Role.ADMIN)
  @Post('/admin')
  async createAdmin(@Body() body: CreateUserAdminBody, @Req() req: any) {
    const { email, name } = body;

    const { user } = await this.createUserAdmin.execute({
      requestOwnerId: req.userId,
      name,
      email,
    });

    return {
      email: user.email,
      name: user.name,
      role: user.role,
      id: user.id,
    };
  }

  @Get()
  async list(@Query() query: { page?: string; itemsPerPage?: string }) {
    const { page, itemsPerPage } = query;

    const { users } = await this.fetchUsers.execute({
      pagination: {
        itemsPerPage: Number(itemsPerPage),
        page: Number(page),
      },
    });

    return users.map(UsersPresenters.toHTTP);
  }

  @Auth(Role.ADMIN)
  @Get('/admin')
  async listAdmins(@Query() query: { page?: string; itemsPerPage?: string }) {
    const { page, itemsPerPage } = query;

    const { users } = await this.fetchUsersAdmin.execute({
      pagination: {
        itemsPerPage: Number(itemsPerPage),
        page: Number(page),
      },
    });

    return users.map(UsersPresenters.toHTTP);
  }

  @Get('/:id')
  async get(@Param('id') id: string) {
    const { user } = await this.getUser.execute({
      id,
    });

    return UsersPresenters.toHTTP(user);
  }

  @Auth(Role.ADMIN)
  @Get('/city-council/:id')
  async fetchUsersFromCityCouncil(@Param('id') id: string) {
    const { users } = await this.fetchUsersByCityCouncil.execute({
      cityCouncilId: id,
    });

    return users.map(UsersPresenters.toHTTP);
  }

  @Post('/by-email')
  async getByEmail(@Body() body: GetUserByEmailBody) {
    const { email } = body;

    const { user } = await this.getUserByEmail.execute({
      email,
    });

    return UsersPresenters.toHTTP(user);
  }

  @Put('/update')
  async update(@Body() body: UpdateUserBody) {
    const {
      email,
      id,
      name,
      acceptNotifications,
      phone,
      cpf,
      politicalParty,
      role,
    } = body;

    const { user } = await this.updateUser.execute({
      name,
      email,
      id,
      acceptNotifications,
      phone,
      cpf,
      politicalParty,
      role,
    });

    return UsersPresenters.toHTTP(user);
  }
}
