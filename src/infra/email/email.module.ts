import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import 'dotenv/config';
import { resolve } from 'node:path';
import { SendMailConsumer } from '../jobs/send-email.consumer';
import { EMAIL_QUEUE } from '@/common/constants';

const url = new URL(process.env.REDIS_URL);

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: url.hostname,
        port: Number(url.port),
        password: url.password,
      },
    }),
    BullModule.registerQueue({
      name: EMAIL_QUEUE,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      template: {
        dir: resolve(
          __dirname,
          '..',
          '..',
          '..',
          'infra',
          'email',
          'templates',
        ),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [SendMailConsumer],
  exports: [BullModule, MailerModule],
})
export class EmailModule {}
