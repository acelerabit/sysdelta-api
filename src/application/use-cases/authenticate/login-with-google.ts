import { Encrypter } from '@/application/cryptography/encrypter';
import { BadRequestException, Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UsersRepository } from '../../repositories/user-repository';
// import { jwtSecret } from './../../../common/constants';
import { User } from './../../entities/user';
import { Subscription } from '@/application/entities/subscription';
import { PlanRepository } from '@/application/repositories/plan-repository';
import { BillingService } from '@/infra/billing/billing.service';
import { SubscriptionRepository } from '@/application/repositories/subscription-repository';

interface LoginWithGoogleRequest {
  email: string;
  name: string;
}

interface LoginWithGoogleResponse {
  accessToken: string;
  user: User;
  subscriptionValue: number;
}

@Injectable()
export class LoginWithGoogle {
  constructor(
    private usersRepository: UsersRepository,
    private planRepository: PlanRepository,
    private subscriptionRepository: SubscriptionRepository,
    private billingService: BillingService,
    private encrypter: Encrypter, // private jwt: JwtService,
  ) {}

  async execute(
    request: LoginWithGoogleRequest,
  ): Promise<LoginWithGoogleResponse> {
    const { email, name } = request;

    const user = await this.usersRepository.findByEmail(email);

    if (user) {
      const token = await this.encrypter.encrypt({
        id: user.id,
        email: user.email,
      });

      const subscriptionValue = user.subscription
        ? user.subscription.value
        : null;

      delete user.password;

      return { accessToken: token, user, subscriptionValue };
    }

    const customer = await this.billingService.createCustomer({
      name,
      email,
      metadata: { plan: 'free' },
    });

    if (!customer) {
      throw new BadRequestException('Não foi possivel criar o usuário', {
        cause: new Error('Não foi possivel criar o customer no stripe'),
        description: 'Não foi possivel criar o customer no stripe',
      });
    }

    const defaultPlan = await this.planRepository.findByDefault();

    if (!defaultPlan) {
      throw new BadRequestException('Não foi possivel criar o usuário', {
        cause: new Error('Não existes planos padrões cadastrados'),
        description: 'Não existes planos padrões cadastrados',
      });
    }

    const newUser = User.create({
      name,
      email,
      role: 'USER',
      createdAt: new Date(),
    });

    const sub = Subscription.create({
      externalId: null,
      active: true,
      planId: defaultPlan.id,
      userId: newUser.id,
      planStatus: 'active',
      value: defaultPlan.value,
    });

    sub.plan = defaultPlan;

    const token = await this.encrypter.encrypt({
      id: newUser.id,
      email: newUser.email,
    });

    if (!token) {
      throw new BadRequestException('Erro ao fazer login');
    }

    newUser.subscriptionId = sub.id;
    newUser.saveSubscription(sub);

    sub.user = newUser;

    await this.usersRepository.create(newUser);
    await this.subscriptionRepository.create(sub);

    const subscriptionValue = newUser.subscription
      ? newUser.subscription.value
      : null;

    delete newUser.password;

    return { accessToken: token, user: newUser, subscriptionValue };
  }

  async logout(res: Response) {
    return res.send({ message: 'Usuário deslogado com suceeso' });
  }

  // async comparePasswords(credentials: {
  //   password: string;
  //   hashedPassword: string;
  // }): Promise<boolean> {
  //   const { password, hashedPassword } = credentials;

  //   return await bcrypt.compare(password, hashedPassword);
  // }

  // async signToken(args: { id: string; email: string }) {
  //   const payload = args;

  //   return this.jwt.signAsync(payload, {
  //     secret: jwtSecret,
  //     expiresIn: '2 days',
  //   });
  // }
}
