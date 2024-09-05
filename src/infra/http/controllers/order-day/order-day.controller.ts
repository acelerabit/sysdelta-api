import { CreateOrderDay } from '@/application/use-cases/order-of-the-day/create-order-day';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { FetchOrderDay } from '@/application/use-cases/order-of-the-day/fetch-order-day';
import { DeleteOrderDay } from '@/application/use-cases/order-of-the-day/delete-order-day';
import { UpdateOrderDay } from '@/application/use-cases/order-of-the-day/update-order-day';
import { CreateOrderDayBody } from './dtos/create-order-day.dto';
import { OrderDaysPresenters } from './presenters/order-day.presenter';
import { UpdateOrderDayBody } from './dtos/update-order-day.dto';
import { GetOrderDay } from '@/application/use-cases/order-of-the-day/get-order-day';
import { GetOrderDayBySession } from '@/application/use-cases/order-of-the-day/get-order-day-by-session';

@Controller('order-day')
export class OrderDayController {
  constructor(
    private createOrderDay: CreateOrderDay,
    private fetchOrderDay: FetchOrderDay,
    private getOrderDay: GetOrderDay,
    private deleteOrderDay: DeleteOrderDay,
    private updateOrderDay: UpdateOrderDay,
    private getOrderDayBySession: GetOrderDayBySession,
  ) {}

  @Post('/:sessionId')
  async create(
    @Param('sessionId') sessionId: string,
    @Body() body: CreateOrderDayBody,
  ) {
    const { orderDay } = await this.createOrderDay.execute({
      ...body,
      sessionId,
    });

    return OrderDaysPresenters.toHTTP(orderDay);
  }

  @Get('/:id')
  async get(@Param('id') id: string) {
    const { orderDay } = await this.getOrderDay.execute({
      orderDayId: id,
    });

    return OrderDaysPresenters.toHTTP(orderDay);
  }

  @Get('/session/:sessionId')
  async getBySessionId(@Param('sessionId') sessionId: string) {
    const { orderDay } = await this.getOrderDayBySession.execute({
      sessionId,
    });

    return OrderDaysPresenters.toHTTP(orderDay);
  }

  @Get('/fetch/:sessionId')
  async fetchPaginated(
    @Param('sessionId') sessionId: string,
    @Query() query: { page?: string; itemsPerPage?: string },
  ) {
    const { page, itemsPerPage } = query;

    const { orderDays } = await this.fetchOrderDay.execute({
      sessionId,
      pagination: {
        itemsPerPage: Number(itemsPerPage),
        page: Number(page),
      },
    });

    return orderDays.map(OrderDaysPresenters.toHTTP);
  }

  @Put()
  async update(@Body() body: UpdateOrderDayBody) {
    await this.updateOrderDay.execute({
      ...body,
    });

    return;
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.deleteOrderDay.execute({
      orderDayId: id,
    });

    return;
  }
}
