import { CreateOffice } from '@/application/use-cases/office/create-office';
import { DeleteOffice } from '@/application/use-cases/office/delete-office';
import { FetchOffice } from '@/application/use-cases/office/fetch-office';
import { GetOffice } from '@/application/use-cases/office/get-office';
import { UpdateOffice } from '@/application/use-cases/office/update-office';
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
import { CreateOfficeBody } from './dtos/create-office.dto';
import { OfficesPresenters } from './presenters/office.presenter';
import { UpdateOfficeBody } from './dtos/update-office.dto';
import { GetOfficeBySession } from '@/application/use-cases/office/get-office-by-session';

@Controller('office')
export class OfficeController {
  constructor(
    private createOffice: CreateOffice,
    private fetchOffice: FetchOffice,
    private getOffice: GetOffice,
    private deleteOffice: DeleteOffice,
    private updateOffice: UpdateOffice,
    private getOfficeBySession: GetOfficeBySession,
  ) {}

  @Post('/:sessionId')
  async create(
    @Param('sessionId') sessionId: string,
    @Body() body: CreateOfficeBody,
  ) {
    const { office } = await this.createOffice.execute({
      ...body,
      sessionId,
    });

    return OfficesPresenters.toHTTP(office);
  }

  @Get('/:id')
  async get(@Param('id') id: string) {
    const { office } = await this.getOffice.execute({
      officeId: id,
    });

    return OfficesPresenters.toHTTP(office);
  }

  @Get('/session/:sessionId')
  async getBySessionId(@Param('sessionId') sessionId: string) {
    const { office } = await this.getOfficeBySession.execute({
      sessionId,
    });

    return OfficesPresenters.toHTTP(office);
  }

  @Get('/fetch/:sessionId')
  async fetchPaginated(
    @Param('sessionId') sessionId: string,
    @Query() query: { page?: string; itemsPerPage?: string },
  ) {
    const { page, itemsPerPage } = query;

    const { offices } = await this.fetchOffice.execute({
      sessionId,
      pagination: {
        itemsPerPage: Number(itemsPerPage),
        page: Number(page),
      },
    });

    return offices.map(OfficesPresenters.toHTTP);
  }

  @Put()
  async update(@Body() body: UpdateOfficeBody) {
    await this.updateOffice.execute({
      ...body,
    });

    return;
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.deleteOffice.execute({
      officeId: id,
    });

    return;
  }
}
