import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter!: nodemailer.Transporter;
  private from!: string;
  private readonly isProd: boolean;

  constructor(private readonly cfg: ConfigService) {
    this.isProd = cfg.get<string>('NODE_ENV') === 'production';
  }

  async onModuleInit() {
    if (this.isProd) {
      // ── Production: Gmail App Password ────────────────────────
      const user = this.cfg.get<string>('GMAIL_USER') ?? '';
      const pass = (this.cfg.get<string>('GMAIL_APP_PASSWORD') ?? '').replace(/\s/g, '');

      if (!user || !pass) {
        this.logger.error('GMAIL_USER or GMAIL_APP_PASSWORD not set — emails will not send in production.');
      }

      this.from = `"eMax Errands & More" <${user}>`;
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,           // SSL — avoids the port-587 STARTTLS block
        auth: { user, pass },
        connectionTimeout: 10_000,
        socketTimeout: 10_000,
      });

      this.logger.log(`Mail: Gmail SMTP (${user})`);
    } else {
      // ── Development: Ethereal fake inbox ─────────────────────
      // Emails are NOT delivered. Instead you get a preview URL in the terminal.
      // View captured emails at https://ethereal.email (or use the URL logged below).
      const account = await nodemailer.createTestAccount();
      this.from = `"eMax Dev" <${account.user}>`;
      this.transporter = nodemailer.createTransport({
        host:   'smtp.ethereal.email',
        port:   587,
        secure: false,
        auth: { user: account.user, pass: account.pass },
      });
      this.logger.log(`Mail: Ethereal dev inbox — ${account.user} / ${account.pass}`);
      this.logger.log('Every email will print a preview URL — open it to read the OTP.');
    }
  }

  async send(opts: MailOptions): Promise<void> {
    try {
      const info = await this.transporter.sendMail({ from: this.from, ...opts });

      if (!this.isProd) {
        const url = nodemailer.getTestMessageUrl(info);
        // ── Open this URL to read the email (OTP code is inside) ──
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
