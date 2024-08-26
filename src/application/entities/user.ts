import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';
import { CityCouncil } from './city-council';

type Role = 'ADMIN' | 'PRESIDENT' | 'COUNCILOR' | 'SECRETARY' | 'ASSISTANT';

export interface UserProps {
  name: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  acceptNotifications?: boolean;
  role: Role;
  createdAt: Date;
  affiliatedCouncilId?: string;
  phone?: string;
  cpf?: string;
  politicalParty?: string;
  active?: boolean;
  affiliatedCouncil?: CityCouncil;
}

export class User {
  private _id: string;
  private props: UserProps;

  constructor(props: Replace<UserProps, { createdAt?: Date }>, id?: string) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      active: props.active ?? false,
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

  public get email(): string {
    return this.props.email;
  }

  public set email(email: string) {
    this.props.email = email;
  }

  public get password(): string {
    return this.props.password;
  }

  public set password(password: string) {
    this.props.password = password;
  }

  public get affiliatedCouncilId(): string {
    return this.props.affiliatedCouncilId;
  }

  public set affiliatedCouncilId(affiliatedCouncilId: string) {
    this.props.affiliatedCouncilId = affiliatedCouncilId;
  }

  public get affiliatedCouncil(): CityCouncil {
    return this.props.affiliatedCouncil;
  }

  public set affiliatedCouncil(affiliatedCouncil: CityCouncil) {
    this.props.affiliatedCouncil = affiliatedCouncil;
  }

  public get avatarUrl(): string {
    return this.props.avatarUrl;
  }

  public set avatarUrl(avatarUrl: string) {
    this.props.avatarUrl = avatarUrl;
  }

  public get active(): boolean {
    return this.props.active;
  }

  public set active(active: boolean) {
    this.props.active = active;
  }

  public get acceptNotifications(): boolean {
    return this.props.acceptNotifications;
  }

  public set acceptNotifications(acceptNotifications: boolean) {
    this.props.acceptNotifications = acceptNotifications;
  }

  public get role(): Role {
    return this.props.role;
  }

  public set role(role: Role) {
    this.props.role = role;
  }

  public get politicalParty(): string {
    return this.props.politicalParty;
  }

  public set politicalParty(politicalParty: string) {
    this.props.politicalParty = politicalParty;
  }

  public get cpf(): string {
    return this.props.cpf;
  }

  public set cpf(cpf: string) {
    this.props.cpf = cpf;
  }

  public get phone(): string {
    return this.props.phone;
  }

  public set phone(phone: string) {
    this.props.phone = phone;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  static create(props: Replace<UserProps, { createdAt?: Date }>, id?: string) {
    const user = new User(props, id);

    return user;
  }
}
