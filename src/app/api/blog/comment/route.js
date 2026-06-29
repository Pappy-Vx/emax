import nodemailer from 'nodemailer';

export async function POST(request) {
  const { postTitle, postSlug, name, email, comment } = await request.json();

  if (!name || !email || !comment || !postSlug) {
    return Response.json({ error: 'All fields are required.' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"eMax Blog" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `New Blog Comment: "${postTitle}" — from ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1c2a43">
        <div style="background:#1c2a43;padding:24px 28px;border-radius:12px 12px 0 0">
          <h1 style="margin:0;color:#fdbd2a;font-size:20px">New Blog Comment</h1>
          <p style="margin:4px 0 0;color:#ffffff80;font-size:13px">Posted via emaxerrands.com</p>
        </div>
        <div style="background:#fbf7ef;padding:28px;border-radius:0 0 12px 12px;border:1px solid #e5e0d4">
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e0d4;width:38%;font-weight:600;font-size:12px;color:#1c2a4380;text-transform:uppercase;letter-spacing:.06em">Post</td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e0d4;font-size:14px">
                <a href="https://emaxerrands.com/blog/${postSlug}" style="color:#1c2a43;text-decoration:underline">${postTitle}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e0d4;font-weight:600;font-size:12px;color:#1c2a4380;text-transform:uppercase;letter-spacing:.06em">Name</td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e0d4;font-size:14px">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e5e0d4;font-weight:600;font-size:12px;color:#1c2a4380;text-transform:uppercase;letter-spacing:.06em">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #e5e0d4;font-size:14px">
                <a href="mailto:${email}" style="color:#1c2a43">${email}</a>
              </td>
            </tr>
          </table>
          <div style="margin-top:20px">
            <div style="font-weight:600;font-size:12px;color:#1c2a4380;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Comment</div>
            <div style="background:#fff;border:1px solid #e5e0d4;border-radius:8px;padding:14px 16px;font-size:14px;line-height:1.65;white-space:pre-wrap">${comment}</div>
          </div>
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e5e0d4">
            <a href="mailto:${email}" style="display:inline-block;padding:10px 20px;background:#fdbd2a;color:#1c2a43;text-decoration:none;border-radius:50px;font-weight:600;font-size:13px">Reply to ${name}</a>
          </div>
        </div>
      </div>
    `,
  });

  return Response.json({ ok: true });
}
