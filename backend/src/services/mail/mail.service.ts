import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as sgMail from '@sendgrid/mail';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);

  // Development: Ethereal SMTP
  private devTransporter!: nodemailer.Transporter;
  private devFrom!: string;

  private readonly isProd: boolean;

  constructor(private readonly cfg: ConfigService) {
    this.isProd = cfg.get<string>('NODE_ENV') === 'production';
  }

  async onModuleInit() {
    if (this.isProd) {
      const apiKey = this.cfg.get<string>('SENDGRID_API_KEY') ?? '';
      if (!apiKey) {
        this.logger.error('SENDGRID_API_KEY not set — emails will not send in production.');
      } else {
        sgMail.setApiKey(apiKey);
        const from = this.cfg.get<string>('SENDGRID_FROM_EMAIL') ?? 'emaxerrands@gmail.com';
        this.logger.log(`Mail: SendGrid (from=${from})`);
      }
    } else {
      const account = await nodemailer.createTestAccount();
      this.devFrom = `"eMax Dev" <${account.user}>`;
      this.devTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: account.user, pass: account.pass },
      });
      this.logger.log(`Mail: Ethereal dev inbox — ${account.user} / ${account.pass}`);
      this.logger.log('Every email will print a preview URL — open it to read the OTP.');
    }
  }

  async send(opts: MailOptions): Promise<void> {
    try {
      if (this.isProd) {
        const from = this.cfg.get<string>('SENDGRID_FROM_EMAIL') ?? 'emaxerrands@gmail.com';
        await sgMail.send({ from, to: opts.to, subject: opts.subject, html: opts.html });
        this.logger.log(`Email sent to ${opts.to}: "${opts.subject}"`);
      } else {
        const info = await this.devTransporter.sendMail({ from: this.devFrom, ...opts });
        const url = nodemailer.getTestMessageUrl(info);
        this.logger.log(`📬 Email preview → ${url}`);
      }
    } catch (err) {
      this.logger.error(`Failed to send email to ${opts.to}: ${(err as Error).message}`);
      throw err;
    }
  }

  async sendOtp(to: string, otp: string): Promise<void> {
    await this.send({
      to,
      subject: 'Your eMax verification code',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#ffffff;">
          <div style="margin-bottom:24px;">
            <span style="display:inline-block;padding:6px 12px;background:#f5c842;color:#0d2137;font-weight:700;font-size:13px;border-radius:6px;letter-spacing:0.08em;">eMax Errands & More</span>
          </div>
          <h2 style="color:#0d2137;font-size:22px;margin:0 0 8px;">Your verification code</h2>
          <p style="color:#555;margin:0 0 24px;">Enter this code to verify your account. It expires in <strong>10 minutes</strong>.</p>
          <div style="display:inline-block;padding:20px 40px;background:#f5f5f0;border-radius:12px;font-size:40px;font-weight:700;letter-spacing:10px;color:#0d2137;margin-bottom:24px;">${otp}</div>
          <p style="color:#999;font-size:13px;">If you did not request this code, you can safely ignore this email.</p>
        </div>
      `,
    });
  }

  async sendWelcome(to: string, name: string): Promise<void> {
    await this.send({
      to,
      subject: 'Welcome to eMax Errands & More!',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#ffffff;">
          <div style="margin-bottom:24px;">
            <span style="display:inline-block;padding:6px 12px;background:#f5c842;color:#0d2137;font-weight:700;font-size:13px;border-radius:6px;letter-spacing:0.08em;">eMax Errands & More</span>
          </div>
          <h2 style="color:#0d2137;font-size:22px;margin:0 0 8px;">Welcome, ${name}!</h2>
          <p style="color:#555;margin:0 0 24px;">Your account is verified and ready. Start booking errands today — we handle the running so you can focus on what matters.</p>
          <a href="https://emaxerrands.com/pricing" style="display:inline-block;padding:14px 28px;background:#f5c842;color:#0d2137;font-weight:700;text-decoration:none;border-radius:8px;">Choose a plan</a>
        </div>
      `,
    });
  }

  async sendErrandUpdate(to: string, errandType: string, status: string): Promise<void> {
    const messages: Record<string, string> = {
      confirmed:    'Your errand has been confirmed and a runner has been assigned.',
      'picked-up':  'Your runner has picked up your errand and is heading to the destination.',
      'on-the-way': 'Your errand is on the way. You will receive a notification once it is delivered.',
      completed:    'Your errand has been completed. Hive Rewards points have been added to your account.',
      cancelled:    'Your errand has been cancelled. Please contact us if you have questions.',
    };
    const body = messages[status] ?? `Your errand status has been updated to: ${status}.`;

    await this.send({
      to,
      subject: `Errand update — ${errandType}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#ffffff;">
          <div style="margin-bottom:24px;">
            <span style="display:inline-block;padding:6px 12px;background:#f5c842;color:#0d2137;font-weight:700;font-size:13px;border-radius:6px;letter-spacing:0.08em;">eMax Errands & More</span>
          </div>
          <h2 style="color:#0d2137;font-size:22px;margin:0 0 8px;">${errandType} Update</h2>
          <p style="color:#555;margin:0 0 24px;">${body}</p>
          <a href="https://emaxerrands.com/dashboard" style="display:inline-block;padding:14px 28px;background:#f5c842;color:#0d2137;font-weight:700;text-decoration:none;border-radius:8px;">View dashboard</a>
        </div>
      `,
    });
  }
}
