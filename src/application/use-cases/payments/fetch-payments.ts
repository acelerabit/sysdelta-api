import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentRepository } from 'src/application/repositories/payment-repository';
import { UsersRepository } from 'src/application/repositories/user-repository';

interface FetchPaymentsRequest {
  userId: string;
}

@Injectable()
export class FetchPayments {
  constructor(
    private userRepository: UsersRepository,
    private paymentRepository: PaymentRepository,
  ) {}
  async execute({ userId }: FetchPaymentsRequest) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestException('Não foi possivel encontrar o usuário', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    const payments = await this.paymentRepository.findByUserId(user.id);

    return { payments };
  }
}
