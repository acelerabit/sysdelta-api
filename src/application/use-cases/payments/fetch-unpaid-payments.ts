import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentRepository } from 'src/application/repositories/payment-repository';
import { UsersRepository } from 'src/application/repositories/user-repository';

interface FetchUnpaidPaymentsRequest {
  userId: string;
}

@Injectable()
export class FetchUnpaidPayments {
  constructor(
    private userRepository: UsersRepository,
    private paymentRepository: PaymentRepository,
  ) {}
  async execute({ userId }: FetchUnpaidPaymentsRequest) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestException('Não foi possivel encontrar o usuário', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    const payments = await this.paymentRepository.findUnpaidByUser(user.id);

    return { payments };
  }
}
