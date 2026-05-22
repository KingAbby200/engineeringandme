import { apiError, apiResponse } from '@/lib/utils/auth';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: { user: process.env.EMAIL_SERVER_USER, pass: process.env.EMAIL_SERVER_PASSWORD },
});

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();
    if (!name || !email || !subject || !message) return apiError('All fields are required');

    await transporter.sendMail({
      from: `Engineering Tutorials <${process.env.EMAIL_FROM}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background: #f9fafb; border-radius: 8px;">
          <h2 style="color: #16a34a;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: 1px solid #e5e7eb; margin: 16px 0;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; color: #374151;">${message}</p>
        </div>
      `,
    });

    return apiResponse({ message: 'Message sent successfully. We\'ll get back to you within 24 hours.' });
  } catch (err) {
    console.error('Contact error:', err);
    return apiError('Failed to send message. Please try again.', 500);
  }
}
