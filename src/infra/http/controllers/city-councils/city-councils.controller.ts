import { AssignResponsibleToCityCouncil } from './../../../../application/use-cases/city-councils/assign-responsible-to-city-council';
import { CreateCityCouncil } from '@/application/use-cases/city-councils/create-city-council';
import { FetchCityCouncils } from '@/application/use-cases/city-councils/fetch-city-councils';
import { GetCityCouncil } from '@/application/use-cases/city-councils/get-city-council';
import { Auth } from '@/infra/decorators/auth.decorator';
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
import { Role } from '@prisma/client';
import { UpdateCityCouncil } from './../../../../application/use-cases/city-councils/update-city-council';
import { UpdateCityCouncilBody } from './dtos/update-city-council-body';
import { CityCouncilsPresenters } from './presenters/create-city-council.presenter';
import { CreateCityCouncilBody } from './dtos/create-city-council-body';
import { FetchCityCouncilsWithoutPaginate } from '@/application/use-cases/city-councils/fetch-city-councils-without-paginate';

@Controller('city-councils')
export class CityCouncilsController {
  constructor(
    private createCityCouncil: CreateCityCouncil,
    private fetchCityCouncils: FetchCityCouncils,
    private fetchCityCouncilsWithoutPaginate: FetchCityCouncilsWithoutPaginate,
    private assignResponsibleToCityCouncil: AssignResponsibleToCityCouncil,
    private updateCityCouncil: UpdateCityCouncil,
    private getCityCouncil: GetCityCouncil,
  ) {}

  @Auth(Role.ADMIN)
  @Post()
  async create(@Body() body: CreateCityCouncilBody, @Req() req: any) {
    const { name, city, state, cnpj } = body;

    const { cityCouncil } = await this.createCityCouncil.execute({
      name,
      city,
      state,
      cnpj,
      userId: req.userId,
    });

    return {
      name: cityCouncil.name,
    };
  }

  @Auth(Role.ADMIN)
  @Get()
  async list(@Query() query: { page?: string; itemsPerPage?: string }) {
    const { page, itemsPerPage } = query;

    const { cityCouncils } = await this.fetchCityCouncils.execute({
      pagination: {
        itemsPerPage: Number(itemsPerPage),
        page: Number(page),
      },
    });

    return cityCouncils.map(CityCouncilsPresenters.toHTTP);
  }

  @Auth(Role.ADMIN)
  @Get('/all')
  async listWithoutPaginate() {
    const { cityCouncils } =
      await this.fetchCityCouncilsWithoutPaginate.execute();

    return cityCouncils.map(CityCouncilsPresenters.toHTTP);
  }

  @Auth(Role.ADMIN)
  @Get('/:id')
  async get(@Param('id') id: string) {
    const { cityCouncil } = await this.getCityCouncil.execute({
      id,
    });

    return CityCouncilsPresenters.toHTTP(cityCouncil);
  }

  @Auth(Role.ADMIN)
  @Post('/assign/:responsibleId')
  async assign(
    @Param('responsibleId') responsibleId: string,
    @Req() req: any,
    @Body() body: { cityCouncilId: string },
  ) {
    const { cityCouncilId } = body;

    const { cityCouncil } = await this.assignResponsibleToCityCouncil.execute({
      responsibleId,
      userId: req.userId,
      cityCouncilId,
    });

    return CityCouncilsPresenters.toHTTP(cityCouncil);
  }

  @Auth(Role.ADMIN)
  @Put('/update')
  async update(@Body() body: UpdateCityCouncilBody, @Req() req: any) {
    const { name, city, state, cnpj } = body;

    const { cityCouncil } = await this.updateCityCouncil.execute({
      name,
      city,
      state,
      cnpj,
      id: req.userId,
    });

    return CityCouncilsPresenters.toHTTP(cityCouncil);
  }
}
