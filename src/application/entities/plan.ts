import { randomUUID } from 'node:crypto';
import { Replace } from 'src/helpers/Replace';

export type PlanIntervalType = 'day' | 'month' | 'week' | 'year';

export interface PlanProps {
  name: string;
  active: boolean;
  value: number;
  interval: PlanIntervalType;
  priceExternalId: string;
  externalId: string;
  createdAt: Date;
  durationInMonths: number;
  trialDays?: number;
  public: boolean;
  isDefault: boolean;
}

export class Plan {
  private _id: string;
  private props: PlanProps;

  constructor(
    props: Replace<PlanProps, { createdAt?: Date; isDefault?: boolean }>,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      trialDays: props.trialDays ?? null,
      isDefault: props.isDefault ?? false,
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

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get value() {
    return this.props.value;
  }

  set value(value: number) {
    this.props.value = value;
  }

  get trialDays() {
    return this.props.trialDays;
  }

  set trialDays(trialDays: number) {
    this.props.trialDays = trialDays;
  }

  get interval() {
    return this.props.interval;
  }

  set interval(interval: PlanIntervalType) {
    this.props.interval = interval;
  }

  get priceExternalId() {
    return this.props.priceExternalId;
  }

  set priceExternalId(priceExternalId: string) {
    this.props.priceExternalId = priceExternalId;
  }

  get durationInMonths() {
    return this.props.durationInMonths;
  }

  set durationInMonths(durationInMonths: number) {
    this.props.durationInMonths = durationInMonths;
  }

  get isDefault() {
    return this.props.isDefault;
  }

  set isDefault(isDefault: boolean) {
    this.props.isDefault = isDefault;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  get active() {
    return this.props.active;
  }

  get public() {
    return this.props.public;
  }

  activatePlan() {
    this.props.active = true;
  }

  deactivatePlan() {
    this.props.active = false;
  }

  publishPlan() {
    this.props.public = true;
  }

  unpublishPlan() {
    this.props.public = false;
  }

  turnPlanDefault() {
    this.props.isDefault = true;
  }

  static create(
    props: Replace<PlanProps, { createdAt?: Date; isDefault?: boolean }>,
    id?: string,
  ) {
    const plan = new Plan(props, id);

    return plan;
  }
}
