import { LegislativeMatter } from '@/application/entities/legislative-matter';
import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';
import { User } from './user';

export interface CityCouncilProps {
  name: string;
  city: string;
  state: string;
  cnpj: string;
  active: boolean;
  councilMembers: User[];
  responsible?: User;
  createdAt: Date;
  legislativeMatters?: LegislativeMatter[];
}

export class CityCouncil {
  private _id: string;
  private props: CityCouncilProps;

  constructor(
    props: Replace<
      CityCouncilProps,
      {
        createdAt?: Date;
        active?: boolean;
        councilMembers?: User[];
      }
    >,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      councilMembers: props.councilMembers ?? [],
      createdAt: props.createdAt ?? new Date(),
      active: props.active ?? false,
      responsible: props.responsible ?? null,
    };
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this.props.name;
  }

  public set name(name: string) {
    this.props.name = name;
  }

  public get city(): string {
    return this.props.city;
  }

  public set city(city: string) {
    this.props.city = city;
  }

  public get state(): string {
    return this.props.state;
  }

  public set state(state: string) {
    this.props.state = state;
  }

  public get cnpj(): string {
    return this.props.cnpj;
  }

  public set cnpj(cnpj: string) {
    this.props.cnpj = cnpj;
  }

  public get active(): boolean {
    return this.props.active;
  }

  public set active(active: boolean) {
    this.props.active = active;
  }

  public get legislativeMatters(): LegislativeMatter[] {
    return this.props.legislativeMatters;
  }

  public set legislativeMatters(legislativeMatters: LegislativeMatter[]) {
    this.props.legislativeMatters = legislativeMatters;
  }

  public get councilMembers(): User[] {
    return this.props.councilMembers;
  }

  public set councilMembers(councilMembers: User[]) {
    this.props.councilMembers = councilMembers;
  }

  public get responsible(): User {
    return this.props.responsible;
  }

  public set responsible(responsible: User) {
    this.props.responsible = responsible;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  static create(
    props: Replace<
      CityCouncilProps,
      {
        createdAt?: Date;
        active?: boolean;
        councilMembers?: User[];
      }
    >,
    id?: string,
  ) {
    const cityCouncil = new CityCouncil(props, id);

    return cityCouncil;
  }
}
