import * as dotenv from 'dotenv';

dotenv.config();

export const jwtSecret = process.env.JWT_SECRET;
export const EMAIL_QUEUE = 'sendMail-queue';
