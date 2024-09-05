import { UpdateLegislativeMatter } from './../../../../application/use-cases/legislative-matter/update-legislative-matter';
import { FetchLegislativeMatterFromSession } from './../../../../application/use-cases/legislative-matter/fetch-legislative-matter-from-session';
import { DeleteLegislativeMatter } from './../../../../application/use-cases/legislative-matter/delete-legislative-matter';
import { GetLegislativeMatter } from './../../../../application/use-cases/legislative-matter/get-legislative-matter';
import { FetchLegislativeMatter } from './../../../../application/use-cases/legislative-matter/fetch-legislative-matter';
import { CreateLegislativeMatter } from '@/application/use-cases/legislative-matter/create-legislative-matter';
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
import { LegislativeMattersPresenters } from './presenters/legislative-matter.presenter';
import { UpdateLegislativeMatterBody } from './dtos/update-legislative-matter.dto';
import { CreateLegislativeMatterBody } from './dtos/create-legislative-matter.dto';

@Controller('legislative-matter')
export class LegislativeMatterController {
  constructor(
    private createLegislativeMatter: CreateLegislativeMatter,
    private fetchLegislativeMatter: FetchLegislativeMatter,
    private fetchLegislativeMatterFromSession: FetchLegislativeMatterFromSession,
    private getLegislativeMatter: GetLegislativeMatter,
    private deleteLegislativeMatter: DeleteLegislativeMatter,
    private updateLegislativeMatter: UpdateLegislativeMatter,
  ) {}

  @Post('/:sessionId/office/:officeId')
  async createInOffice(
    @Param('sessionId') sessionId: string,
    @Param('officeId') officeId: string,

    @Body() body: CreateLegislativeMatterBody,
  ) {
    await this.createLegislativeMatter.execute({
      ...body,
      sessionId,
      officeId,
    });

    return;
  }

  @Post('/:sessionId/order-day/:orderDayId')
  async createInOrderDay(
    @Param('sessionId') sessionId: string,
    @Param('orderDayId') orderDayId: string,

    @Body() body: CreateLegislativeMatterBody,
  ) {
    await this.createLegislativeMatter.execute({
      ...body,
      sessionId,
      orderDayId,
    });

    return;
  }

  @Get('/:id')
  async get(@Param('id') id: string) {
    const { legislativeMatter } = await this.getLegislativeMatter.execute({
      legislativeMatterId: id,
    });

    return LegislativeMattersPresenters.toHTTP(legislativeMatter);
  }

  @Get('/')
  async fetchPaginated(
    @Query() query: { page?: string; itemsPerPage?: string },
  ) {
    const { page, itemsPerPage } = query;

    const { legislativeMatters } = await this.fetchLegislativeMatter.execute({
      pagination: {
        itemsPerPage: Number(itemsPerPage),
        page: Number(page),
      },
    });

    return legislativeMatters.map(LegislativeMattersPresenters.toHTTP);
  }

  @Get('/from-session/:sessionId/office/:officeId')
  async fetch(
    @Param('sessionId') sessionId: string,
    @Param('officeId') officeId: string,
    @Query() query: { page?: string; itemsPerPage?: string },
  ) {
    const { page, itemsPerPage } = query;

    const { legislativeMatters } =
      await this.fetchLegislativeMatterFromSession.execute({
        sessionId,
        pagination: {
          itemsPerPage: Number(itemsPerPage),
          page: Number(page),
        },
        from: officeId,
      });

    return legislativeMatters.map(LegislativeMattersPresenters.toHTTP);
  }

  @Get('/from-session/:sessionId/order-day/:orderDayId')
  async fetchByType(
    @Param('sessionId') sessionId: string,
    @Param('orderDayId') orderDayId: string,

    @Query() query: { page?: string; itemsPerPage?: string },
  ) {
    const { page, itemsPerPage } = query;

    const { legislativeMatters } =
      await this.fetchLegislativeMatterFromSession.execute({
        sessionId,

        pagination: {
          itemsPerPage: Number(itemsPerPage),
          page: Number(page),
        },
        from: orderDayId,
      });

    return legislativeMatters.map(LegislativeMattersPresenters.toHTTP);
  }

  @Put('/:legislativeMatterId')
  async update(
    @Body() body: UpdateLegislativeMatterBody,
    @Param('legislativeMatterId') legislativeMatterId: string,
  ) {
    await this.updateLegislativeMatter.execute({
      ...body,
      legislativeMatterId,
    });

    return;
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.deleteLegislativeMatter.execute({
      legislativeMatterId: id,
    });

    return;
  }
}
