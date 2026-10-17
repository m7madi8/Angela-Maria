import 'server-only';
import nodemailer from 'nodemailer';
import type { SignInEnv } from '@/server/auth/config';

export type SignInMailer = {
  sendSignInLink: (to: string, url: string) => Promise<void>;
};

export function createSmtpMailer(env: SignInEnv): SignInMailer {
  const port = Number(env.SMTP_PORT);
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: env.SMTP_USER
      ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASSWORD ?? '',
        }
      : undefined,
  });

  return {
    async sendSignInLink(to, url) {
      await transport.sendMail({
        from: env.EMAIL_FROM ?? '',
        to,
        subject: 'Angela-Maria administration sign-in',
        text: [
          'Use this link to open Angela-Maria administration. It expires in 15 minutes and works once.',
          url,
          '',
          'استخدمي هذا الرابط لفتح إدارة Angela-Maria. ينتهي خلال 15 دقيقة ويعمل مرة واحدة.',
          url,
        ].join('\n'),
      });
    },
  };
}
