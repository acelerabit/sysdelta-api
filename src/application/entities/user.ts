import { BadRequestException } from '@nestjs/common';
import { Replace } from './../../helpers/Replace';
import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';

export interface UserProps {
  email: string;
  password?: string;
  createdAt: Date;
}

export class User {
  private _id: string;
  private props: UserProps;

  constructor(props: Replace<UserProps, { createdAt?: Date }>) {
    this._id = randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
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

  public get createdAt(): Date {
    return this.props.createdAt;
  }
}
