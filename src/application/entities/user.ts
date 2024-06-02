import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';
import { Subscription } from './subscription';

type Role = 'ADMIN' | 'USER';

export interface UserProps {
  name: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  acceptNotifications?: boolean;
  role: Role;
  createdAt: Date;
  externalId?: string;
  subscriptionId?: string;
  subscription?: Subscription;
}

export class User {
  private _id: string;
  private props: UserProps;

  constructor(props: Replace<UserProps, { createdAt?: Date }>, id?: string) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      externalId: props.externalId ?? null,
      subscriptionId: props.subscriptionId ?? null,
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

  public get avatarUrl(): string {
    return this.props.avatarUrl;
  }

  public set avatarUrl(avatarUrl: string) {
    this.props.avatarUrl = avatarUrl;
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

  public get subscriptionId(): string {
    return this.props.subscriptionId;
  }

  set subscriptionId(subscriptionId: string) {
    this.props.subscriptionId = subscriptionId;
  }

  public get externalId(): string {
    return this.props.externalId;
  }

  set externalId(externalId: string) {
    this.props.externalId = externalId;
  }

  public get subscription(): Subscription {
    return this.props.subscription;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  saveSubscription(subscription: Subscription) {
    this.props.subscription = subscription;
  }

  updateUserSubscription(subscription: Subscription) {
    this.props.subscription = subscription;
  }

  static create(props: Replace<UserProps, { createdAt?: Date }>, id?: string) {
    const user = new User(props, id);

    return user;
  }
}
