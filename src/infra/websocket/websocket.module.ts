import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [WebsocketService],
})
export class WebSocketModule {}
