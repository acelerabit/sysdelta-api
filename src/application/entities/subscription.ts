import { randomUUID } from 'node:crypto';
import { Replace } from 'src/helpers/Replace';
import { Plan } from './plan';
import { User } from './user';

type UserPlanStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'paused'
  | 'trialing'
  | 'unpaid';

export interface SubscriptionProps {
  externalId: string;
  value: number;
  userId?: string;
  user?: User;
  planId: string;
  plan?: Plan;
  expiration?: number;
  planStatus: UserPlanStatus;
  active: boolean;
  createdAt: Date;
  paymentMethodId?: string;
}

export class Subscription {
  private _id: string;
  private props: SubscriptionProps;

  constructor(
    props: Replace<SubscriptionProps, { createdAt?: Date }>,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  get id() {
    return this._id;
  }

  get externalId() {
    return this.props.externalId;
  }

  set externalId(externalId: string) {
    this.props.externalId = externalId;
  }

  get paymentMethodId() {
    return this.props.paymentMethodId;
  }

  set paymentMethodId(paymentMethodId: string) {
    this.props.paymentMethodId = paymentMethodId;
  }

  get value() {
    return this.props.value;
  }

  set value(value: number) {
    this.props.value = value;
  }

  get userId() {
    return this.props.userId;
  }

  get planId() {
    return this.props.planId;
  }

  set planId(planId: string) {
    this.props.planId = planId;
  }

  get plan() {
    return this.props.plan;
  }

  set plan(plan: Plan) {
    this.props.plan = plan;
  }

  get active() {
    return this.props.active;
  }

  set active(active: boolean) {
    this.props.active = active;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  get planStatus() {
    return this.props.planStatus;
  }

  set planStatus(planStatus: UserPlanStatus) {
    this.props.planStatus = planStatus;
  }

  get expiration() {
    return this.props.expiration;
  }

  set expiration(expiration: number) {
    this.props.expiration = expiration;
  }

  get user() {
    return this.props.user;
  }

  set user(user: User) {
    this.props.user = user;
  }

  static create(
    props: Replace<SubscriptionProps, { createdAt?: Date }>,
    id?: string,
  ) {
    const subscription = new Subscription(props, id);

    return subscription;
  }
}
