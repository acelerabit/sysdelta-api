import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

@Injectable()
export class DateService {
  // Método para formatar uma data para o formato ISO
  formatDate(date: string | Date): string {
    return dayjs(date).toISOString();
  }

  formatToPrismaDateTime(inputDate: string | Date) {
    const formattedDate = dayjs(inputDate).format('YYYY-MM-DDTHH:mm:ssZ');

    return formattedDate;
  }

  // Método para verificar se a data passada já ocorreu
  isDatePassed(date: string | Date): boolean {
    return dayjs(date).isBefore(dayjs(), 'day');
  }

  toUTC(date: Date) {
    return dayjs(date).utc().format('YYYY-MM-DD');
  }

  dateToSaveInDB(date: Date) {
    const dateFormat = dayjs(date).format('YYYY-MM-DD');

    return new Date(dateFormat.toString()).toISOString();
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  convertUnixToUTC(unix_time: string) {
    const unixDate = dayjs.unix(Number(unix_time));
    return dayjs(unixDate).utc().local().format();
  }
}
