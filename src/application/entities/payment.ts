import { randomUUID } from 'node:crypto';
import { Replace } from 'src/helpers/Replace';
import { User } from './user';
import { Subscription } from './subscription';

type PaymentStatus = 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';

export interface PaymentProps {
  externalId: string;
  value: number;
  userId?: string;
  user?: User;
  subscriptionId: string;
  subscription?: Subscription;
  paymentDate?: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  voucher?: string;
  status: PaymentStatus;
  attempts: number;
}

export class Payment {
  private _id: string;
  private props: PaymentProps;

  constructor(
    props: Replace<
      PaymentProps,
      {
        createdAt?: Date;
        status?: PaymentStatus;
        attempts?: number;
      }
    >,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      voucher: props.voucher ?? null,
      paymentDate: props.paymentDate ?? null,
      status: props.status ?? 'open',
      attempts: props.attempts ?? 0,
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

  get value() {
    return this.props.value;
  }

  set value(value: number) {
    this.props.value = value;
  }

  get attempts() {
    return this.props.attempts;
  }

  set attempts(attempts: number) {
    this.props.attempts = attempts;
  }

  get status() {
    return this.props.status;
  }

  set status(status: PaymentStatus) {
    this.props.status = status;
  }

  get userId() {
    return this.props.userId;
  }

  get user() {
    return this.props.user;
  }

  set user(user: User) {
    this.props.user = user;
  }

  get completed() {
    return this.props.completed;
  }

  set completed(completed: boolean) {
    this.props.completed = completed;
  }

  get subscriptionId() {
    return this.props.subscriptionId;
  }

  set subscriptionId(subscriptionId: string) {
    this.props.subscriptionId = subscriptionId;
  }

  get subscription() {
    return this.props.subscription;
  }

  set subscription(subscription: Subscription) {
    this.props.subscription = subscription;
  }

  get paymentDate() {
    return this.props.paymentDate;
  }

  set paymentDate(paymentDate: Date) {
    this.props.paymentDate = paymentDate;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  get voucher() {
    return this.props.voucher;
  }

  set voucher(voucher: string) {
    this.props.voucher = voucher;
  }

  static create(
    props: Replace<
      PaymentProps,
      { createdAt?: Date; status?: PaymentStatus; attempts?: number }
    >,
    id?: string,
  ) {
    const payment = new Payment(props, id);

    return payment;
  }
}
