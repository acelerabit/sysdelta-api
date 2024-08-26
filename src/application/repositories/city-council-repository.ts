import { PaginationParams } from '@/@shared/pagination-interface';
import { CityCouncil } from '../entities/city-council';

export abstract class CityCouncilsRepository {
  abstract create(cityCouncil: CityCouncil): Promise<void>;
  abstract findAll(pagination: PaginationParams): Promise<CityCouncil[]>;
  abstract findAllWithoutPaginate(): Promise<CityCouncil[]>;
  abstract count(): Promise<number>;
  abstract findByName(name: string): Promise<CityCouncil | null>;
  abstract findById(id: string): Promise<CityCouncil | null>;
  abstract update(cityCouncil: CityCouncil): Promise<void>;
  abstract assignResponsible(cityCouncil: CityCouncil): Promise<void>;
}
