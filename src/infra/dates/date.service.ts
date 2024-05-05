import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class DateService {
  // Método para formatar uma data para o formato ISO
  formatDate(date: string | Date): string {
    return dayjs(date).toISOString();
  }

  // Método para verificar se a data passada já ocorreu
  isDatePassed(date: string | Date): boolean {
    return dayjs(date).isBefore(dayjs(), 'day');
  }
}
