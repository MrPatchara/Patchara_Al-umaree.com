import { Resend } from 'resend';

export default async function handler(req, res) {
  // เช็คว่าเป็น POST request หรือไม่
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ดึงข้อมูลจาก form
    let { name, email, subject, message } = req.body;

    // ตรวจสอบว่ามีข้อมูลครบหรือไม่ (trim whitespace)
    name = name?.trim() || '';
    email = email?.trim() || '';
    subject = subject?.trim() || '';
    message = message?.trim() || '';

    // Debug log
    console.log('Received data:', { name, email, subject, message });

    if (!name || !email || !subject || !message) {
      console.log('Missing fields - name:', !!name, 'email:', !!email, 'subject:', !!subject, 'message:', !!message);
      return res.status(400).json({ error: 'All fields are required' });
    }

    // ตรวจสอบ email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // สร้าง Resend client ด้วย API Key จาก Environment Variable
    const resend = new Resend(process.env.RESEND_API_KEY);

    // ส่งเมล์
    const data = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // ใช้ domain ของ Resend ก่อน
      to: 'Patcharaalumaree@gmail.com', // เมล์ของคุณ
      replyTo: email, // เมล์ของคนที่ส่ง form
      subject: `[Portfolio Contact] ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully!',
      data 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
}
