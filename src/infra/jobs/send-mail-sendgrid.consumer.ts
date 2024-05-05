import { Process, Processor } from '@nestjs/bull';
import { MailDataRequired } from '@sendgrid/mail';
import { Job } from 'bull';
import 'dotenv/config';
import { EMAIL_QUEUE } from 'src/common/constants';
import { SendGridClient } from '../email/sendgrid/send-grid.client';

@Processor(EMAIL_QUEUE)
export class SendMailConsumer {
  constructor(private readonly sendGridClient: SendGridClient) {}

  @Process('sendMail-job')
  async sendMailJob(
    job: Job<{ email: string; subject: string; text: string }>,
  ) {
    const { email, subject, text } = job.data;

    try {
      const mail: MailDataRequired = {
        to: email,
        from: process.env.SMTP_FROM,
        subject,
        content: [{ type: 'text/plain', value: text }],
      };
      await this.sendGridClient.send(mail);
    } catch (err) {
      console.log(err);
    }
  }
}
