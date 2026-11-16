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

  private transporter?: nodemailer.Transporter;
  private from!: string;

  private readonly isProd: boolean;

  constructor(private readonly cfg: ConfigService) {
    this.isProd = cfg.get<string>('NODE_ENV') === 'production';
  }

  async onModuleInit() {
    if (this.isProd) {
      const host = this.cfg.get<string>('SMTP_HOST');
      const user = this.cfg.get<string>('SMTP_USER');
      const pass = this.cfg.get<string>('SMTP_PASS');
      if (!host || !user || !pass) {
        this.logger.error('SMTP_HOST / SMTP_USER / SMTP_PASS not set — emails will not send in production.');
        return;
      }
      const port = parseInt(this.cfg.get<string>('SMTP_PORT') ?? '465', 10);
      this.from = this.cfg.get<string>('SMTP_FROM') ?? `"eMax Errands & More" <${user}>`;
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        // Fail fast if the port is blocked so OTP requests don't hang.
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
      });
      this.transporter
        .verify()
        .then(() => this.logger.log(`Mail: SMTP ready (${host}:${port}, from=${this.from})`))
        .catch((err) => this.logger.error(`Mail: SMTP connection failed — ${(err as Error).message}`));
    } else {
      const account = await nodemailer.createTestAccount();
      this.from = `"eMax Dev" <${account.user}>`;
      this.transporter = nodemailer.createTransport({
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
    if (!this.transporter) throw new Error('Mail transport is not configured.');
    try {
      const info = await this.transporter.sendMail({ from: this.from, ...opts });
      if (this.isProd) {
        this.logger.log(`Email sent to ${opts.to}: "${opts.subject}"`);
      } else {
        this.logger.log(`📬 Email preview → ${nodemailer.getTestMessageUrl(info)}`);
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

  async sendSubscriptionRenewalReminder(to: string, opts: {
    planName: string;
    priceFmt: string;
    daysLeft: number;
    renewalDate: string;
    billingCycle: string;
    cancelUrl?: string;
  }): Promise<void> {
    const { planName, priceFmt, daysLeft, renewalDate, billingCycle } = opts;
    const per = billingCycle === 'yearly' ? 'year' : 'month';
    await this.send({
      to,
      subject: `Your ${planName} subscription renews in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#ffffff;">
          <div style="padding:28px 28px 0;">
            <span style="display:inline-block;padding:6px 12px;background:#f5c842;color:#0d2137;font-weight:700;font-size:13px;border-radius:6px;letter-spacing:0.06em;">eMax Errands &amp; More</span>
          </div>
          <div style="padding:28px 28px 0;">
            <h1 style="color:#0d2137;font-size:26px;font-weight:800;margin:0 0 16px;line-height:1.25;">
              Your ${planName} subscription renews for ${priceFmt}/${per} in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}
            </h1>
            <p style="color:#4a5568;font-size:15px;line-height:1.6;margin:0 0 20px;">
              You're set to auto-renew your eMax Errands &amp; More subscription. Starting <strong>${renewalDate}</strong>, you'll continue to enjoy priority errand scheduling, loyalty rewards, and all your plan benefits for ${priceFmt}/${per}.
            </p>
          </div>
          <div style="margin:24px 28px;background:#f7f8fa;border-radius:12px;padding:20px;">
            <p style="font-size:13px;font-weight:700;color:#0d2137;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;">Your plan</p>
            <p style="font-size:15px;font-weight:600;color:#0d2137;margin:0 0 4px;">${planName} · ${billingCycle === 'yearly' ? 'Annual' : 'Monthly'} billing</p>
            <p style="font-size:14px;color:#718096;margin:0;">Renews on ${renewalDate} at ${priceFmt}/${per}</p>
          </div>
          <div style="padding:0 28px 8px;">
            <p style="color:#718096;font-size:13px;line-height:1.6;margin:0 0 20px;">
              If you'd like to cancel before the renewal date, you can do so anytime from your subscription settings. Your plan will remain active through <strong>${renewalDate}</strong>.
            </p>
            <a href="https://emaxerrands.com/dashboard/subscription" style="display:inline-block;padding:13px 26px;background:#0d2137;color:#f5c842;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;margin-bottom:24px;">
              Manage subscription
            </a>
          </div>
          <div style="border-top:1px solid #edf2f7;padding:20px 28px;">
            <p style="color:#a0aec0;font-size:12px;margin:0;">
              You received this because you have an active eMax Errands &amp; More subscription. Questions? Reply to this email or visit <a href="https://emaxerrands.com" style="color:#0d2137;">emaxerrands.com</a>.
            </p>
          </div>
        </div>
      `,
    });
  }

  async sendPlanWelcome(to: string, opts: {
    planName: string;
    errands: number;
    priceFmt: string;
    billingCycle: 'monthly' | 'yearly';
    activatedOn: string;
    resetsOn: string;
    nextBillingOn: string;
    dashboardUrl: string;
  }): Promise<void> {
    const { planName, errands, priceFmt, billingCycle, activatedOn, resetsOn, nextBillingOn, dashboardUrl } = opts;
    const allowance = errands > 0 ? `${errands} errands` : 'Unlimited errands';
    const per = billingCycle === 'yearly' ? 'year' : 'month';
    const row = (label: string, value: string) => `
      <tr>
        <td style="padding:7px 0;color:#718096;font-size:14px;">${label}</td>
        <td style="padding:7px 0;color:#0d2137;font-size:14px;font-weight:600;text-align:right;">${value}</td>
      </tr>`;
    const h2 = (text: string) =>
      `<p style="font-size:13px;font-weight:700;color:#0d2137;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;">${text}</p>`;
    const li = 'style="margin:0 0 8px;"';

    await this.send({
      to,
      subject: `Welcome to your ${planName} plan, good neighbor!`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#ffffff;color:#0d2137;">
          <div style="padding:28px 28px 0;">
            <span style="display:inline-block;padding:6px 12px;background:#f5c842;color:#0d2137;font-weight:700;font-size:13px;border-radius:6px;letter-spacing:0.06em;">eMax Errands &amp; More</span>
          </div>

          <div style="padding:24px 28px 0;">
            <h1 style="font-size:26px;font-weight:800;margin:0 0 12px;line-height:1.25;">Howdy, Good Neighbor!</h1>
            <p style="color:#4a5568;font-size:15px;line-height:1.6;margin:0 0 12px;">
              Welcome to your <strong>${planName}</strong> plan. You now have <strong>${allowance}/month</strong>.
            </p>
            <p style="color:#4a5568;font-size:15px;line-height:1.6;margin:0;">
              Thank you for choosing eMax Errands &amp; More. We're ready to help clear your to-do list so you have more time for what matters.
            </p>
          </div>

          <div style="margin:24px 28px;background:#f7f8fa;border-radius:12px;padding:18px 20px;">
            ${h2('Your plan at a glance')}
            <table style="width:100%;border-collapse:collapse;">
              ${row('Plan', planName)}
              ${row('Monthly allowance', allowance)}
              ${row('Activated', activatedOn)}
              ${row('Allowance resets', resetsOn)}
              ${row('Subscription', `${priceFmt}/${per}`)}
              ${row('Next billing date', nextBillingOn)}
            </table>
          </div>

          <div style="padding:0 28px;">
            ${h2('How to request an errand')}
            <ol style="color:#4a5568;font-size:14px;line-height:1.6;padding-left:20px;margin:0 0 12px;">
              <li ${li}>Log in to your account and tap <strong>Request an errand</strong>.</li>
              <li ${li}>Add the errand type, pickup and drop-off locations, preferred date and time, and any instructions. If someone else will receive it, include their phone number in the instructions.</li>
              <li ${li}>We confirm availability and the details before your errand is scheduled.</li>
            </ol>
            <p style="color:#4a5568;font-size:14px;line-height:1.6;margin:0 0 24px;">
              Any service listed on our website is eligible. Have something else in mind? Just let us know.
            </p>

            ${h2('Good to know')}
            <ul style="color:#4a5568;font-size:14px;line-height:1.6;padding-left:20px;margin:0 0 24px;">
              <li ${li}><strong>One errand</strong> covers 2 stops (pickup and drop-off), up to 45 minutes, within Columbus. Trips outside the area are $0.65 per additional mile.</li>
              <li ${li}><strong>Prices</strong> are starting service fees. Purchases, extra mileage and third-party charges are additional. Equipment transport depends on size, handling needs and availability.</li>
              <li ${li}><strong>Unused errands</strong> don't roll over. They expire when your allowance resets.</li>
              <li ${li}><strong>Hours:</strong> Monday–Friday 8 a.m.–5 p.m. and Saturday 10 a.m.–2 p.m. For anything outside these hours, call (812) 565-9585 at least 48 hours ahead.</li>
            </ul>

            ${h2('Ready for your first errand?')}
            <p style="color:#4a5568;font-size:15px;line-height:1.6;margin:0 0 18px;">
              What's the errand you've been putting off? Let's take it off your list.
            </p>
            <a href="${dashboardUrl}" style="display:inline-block;padding:13px 26px;background:#f5c842;color:#0d2137;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">Request your first errand</a>
            <p style="font-size:13px;color:#718096;margin:14px 0 0;">
              View your plan or manage your subscription anytime in <a href="${dashboardUrl}/subscription" style="color:#0d2137;">your account</a>.
            </p>

            <p style="color:#4a5568;font-size:15px;line-height:1.6;margin:28px 0 24px;">
              Warmly,<br />
              <strong>The eMax Errands &amp; More Team</strong><br />
              <span style="color:#718096;font-style:italic;">More time for what matters.</span>
            </p>
          </div>

          <div style="border-top:1px solid #edf2f7;padding:20px 28px;">
            <p style="color:#a0aec0;font-size:12px;margin:0;">
              You received this because you subscribed to eMax Errands &amp; More. Questions? Reply to this email or call (812) 565-9585.
            </p>
          </div>
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
