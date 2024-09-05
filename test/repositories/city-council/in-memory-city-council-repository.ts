import { PaginationParams } from '@/@shared/pagination-interface';
import { CityCouncil } from '@/application/entities/city-council';
import { CityCouncilsRepository } from '@/application/repositories/city-council-repository';

export class InMemoryCityCouncilRepository implements CityCouncilsRepository {
  public cityCouncils: CityCouncil[] = [];

  async create(cityCouncil: CityCouncil): Promise<void> {
    this.cityCouncils.push(cityCouncil);
  }

  async findAll(pagination: PaginationParams): Promise<CityCouncil[]> {
    const { page, itemsPerPage } = pagination;
    const startIndex = (page - 1) * itemsPerPage;
    return this.cityCouncils.slice(startIndex, startIndex + itemsPerPage);
  }

  async findAllWithoutPaginate(): Promise<CityCouncil[]> {
    return this.cityCouncils;
  }

  async count(): Promise<number> {
    return this.cityCouncils.length;
  }

  async findByName(name: string): Promise<CityCouncil | null> {
    return (
      this.cityCouncils.find((cityCouncil) => cityCouncil.name === name) || null
    );
  }

  async findById(id: string): Promise<CityCouncil | null> {
    return (
      this.cityCouncils.find((cityCouncil) => cityCouncil.id === id) || null
    );
  }

  async delete(id: string): Promise<void> {
    this.cityCouncils = this.cityCouncils.filter(
      (cityCouncil) => cityCouncil.id !== id,
    );
  }

  async update(cityCouncil: CityCouncil): Promise<void> {
    const index = this.cityCouncils.findIndex((c) => c.id === cityCouncil.id);
    if (index !== -1) {
      this.cityCouncils[index] = cityCouncil;
    }
  }

  async assignResponsible(cityCouncil: CityCouncil): Promise<void> {
    const index = this.cityCouncils.findIndex((c) => c.id === cityCouncil.id);
    if (index !== -1) {
      this.cityCouncils[index].responsible = cityCouncil.responsible;
    }
  }
}
