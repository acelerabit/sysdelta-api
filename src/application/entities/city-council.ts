import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';
import { User } from './user';

export interface CityCouncilProps {
  name: string;
  councilMembers: User[];
  responsible?: User;
}

export class CityCouncil {
  private _id: string;
  private props: CityCouncilProps;

  constructor(
    props: Replace<
      CityCouncilProps,
      {
        // createdAt?: Date;
        councilMembers?: User[];
      }
    >,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      councilMembers: props.councilMembers ?? [],
      // createdAt: props.createdAt ?? new Date(),
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

  // get createdAt() {
  //   return this.props.createdAt;
  // }

  // set createdAt(createdAt: Date) {
  //   this.props.createdAt = createdAt;
  // }

  static create(
    props: Replace<
      CityCouncilProps,
      {
        // createdAt?: Date
        councilMembers?: User[];
      }
    >,
    id?: string,
  ) {
    const cityCouncil = new CityCouncil(props, id);

    return cityCouncil;
  }
}
