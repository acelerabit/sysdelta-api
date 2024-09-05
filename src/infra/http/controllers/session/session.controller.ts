import { CreateSession } from '@/application/use-cases/session/create-session';
import { DeleteSession } from '@/application/use-cases/session/delete-session';
import { FetchSession } from '@/application/use-cases/session/fetch-sessions';
import { GetSession } from '@/application/use-cases/session/get-session';
import { UpdateSession } from '@/application/use-cases/session/update-session';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateSessionBody } from './dtos/create-session-body';
import { SessionsPresenters } from './presenters/session.presenter';
import { UpdateSessionBody } from './dtos/update-session-body';

@Controller('session')
export class SessionController {
  constructor(
    private createSession: CreateSession,
    private fetchSession: FetchSession,
    private getSession: GetSession,
    private deleteSession: DeleteSession,
    private updateSession: UpdateSession,
  ) {}

  @Post('/:cityCouncilId')
  async create(
    @Param('cityCouncilId') cityCouncilId: string,
    @Body() body: CreateSessionBody,
  ) {
    await this.createSession.execute({
      ...body,
      cityCouncilId,
    });

    return;
  }

  @Get('/:id')
  async get(@Param('id') id: string) {
    await this.getSession.execute({
      sessionId: id,
    });

    return;
  }

  @Get('/fetch/:cityCouncilId')
  async fetchPaginated(
    @Param('cityCouncilId') cityCouncilId: string,
    @Query() query: { page?: string; itemsPerPage?: string },
  ) {
    const { page, itemsPerPage } = query;

    const { sessions } = await this.fetchSession.execute({
      cityCouncilId,

      pagination: {
        itemsPerPage: Number(itemsPerPage),
        page: Number(page),
      },
    });

    return sessions.map(SessionsPresenters.toHTTP);
  }

  @Put('/:sessionId')
  async update(
    @Param('sessionId') sessionId: string,
    @Body() body: UpdateSessionBody,
  ) {
    await this.updateSession.execute({
      ...body,
      sessionId,
    });

    return;
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.deleteSession.execute({
      sessionId: id,
    });

    return;
  }
}
