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

@Controller('cityCouncils')
export class cityCouncilsController {
  constructor(
    private createCityCouncil: CreateCityCouncil,
    private fetchCityCouncils: FetchCityCouncils,
    private updateCityCouncil: UpdateCityCouncil,
    private getCityCouncil: GetCityCouncil,
  ) {}

  @Auth(Role.ADMIN)
  @Post()
  async create(@Body() body: { name: string; userId: string }) {
    const { name, userId } = body;

    const { cityCouncil } = await this.createCityCouncil.execute({
      name,
      userId,
    });

    return {
      responsible: {
        name: cityCouncil.responsible.name,
        email: cityCouncil.responsible.name,
      },
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
  @Get('/:id')
  async get(@Param('id') id: string, @Req() req: any) {
    const { cityCouncil } = await this.getCityCouncil.execute({
      id,
      userId: req.userId,
    });

    return CityCouncilsPresenters.toHTTP(cityCouncil);
  }

  @Auth(Role.ADMIN)
  @Put('/update')
  async update(@Body() body: UpdateCityCouncilBody, @Req() req: any) {
    const { name } = body;

    const { cityCouncil } = await this.updateCityCouncil.execute({
      name,
      id: req.userId,
    });

    return CityCouncilsPresenters.toHTTP(cityCouncil);
  }
}
