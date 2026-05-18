import nodemailer from 'nodemailer';

export async function POST(request) {
  const { name, phone, email, service, when, message } = await request.json();

  if (!name || !phone || !service || !message) {
    return Response.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"eMax Website" <${process.env.GMAIL_USER}>`,
    to: 'emaxerrands@gmail.com',
    replyTo: email || undefined,
    subject: `New Booking: ${service} — ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1c2a43">
        <div style="background:#1c2a43;padding:24px 28px;border-radius:12px 12px 0 0">
          <h1 style="margin:0;color:#fdbd2a;font-size:22px">New Booking Request</h1>
          <p style="margin:4px 0 0;color:#ffffff99;font-size:14px">Submitted via emaxerrands.com</p>
        </div>
        <div style="background:#f9f6ee;padding:28px;border-radius:0 0 12px 12px;border:1px solid #e5e0d4">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:10px 0;border-bottom:1px solid #e5e0d4;width:38%;font-weight:600;font-size:13px;color:#1c2a4399;text-transform:uppercase;letter-spacing:.06em">Name</td><td style="padding:10px 0;border-bottom:1px solid #e5e0d4;font-size:15px">${name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e5e0d4;font-weight:600;font-size:13px;color:#1c2a4399;text-transform:uppercase;letter-spacing:.06em">Phone</td><td style="padding:10px 0;border-bottom:1px solid #e5e0d4;font-size:15px"><a href="tel:${phone}" style="color:#1c2a43">${phone}</a></td></tr>
            ${email ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e5e0d4;font-weight:600;font-size:13px;color:#1c2a4399;text-transform:uppercase;letter-spacing:.06em">Email</td><td style="padding:10px 0;border-bottom:1px solid #e5e0d4;font-size:15px"><a href="mailto:${email}" style="color:#1c2a43">${email}</a></td></tr>` : ''}
            <tr><td style="padding:10px 0;border-bottom:1px solid #e5e0d4;font-weight:600;font-size:13px;color:#1c2a4399;text-transform:uppercase;letter-spacing:.06em">Service</td><td style="padding:10px 0;border-bottom:1px solid #e5e0d4;font-size:15px"><strong style="color:#fdbd2a">${service}</strong></td></tr>
            ${when ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e5e0d4;font-weight:600;font-size:13px;color:#1c2a4399;text-transform:uppercase;letter-spacing:.06em">When</td><td style="padding:10px 0;border-bottom:1px solid #e5e0d4;font-size:15px">${when}</td></tr>` : ''}
          </table>
          <div style="margin-top:20px">
            <div style="font-weight:600;font-size:13px;color:#1c2a4399;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Message</div>
            <div style="background:#fff;border:1px solid #e5e0d4;border-radius:8px;padding:14px 16px;font-size:15px;line-height:1.6;white-space:pre-wrap">${message}</div>
          </div>
        </div>
      </div>
    `,
  });

  return Response.json({ ok: true });
}
