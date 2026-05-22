import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

const FROM = `Engineering Tutorials <${process.env.EMAIL_FROM}>`;

export async function sendOTPEmail(email, otp, name) {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Verify your Engineering Tutorials account',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'IBM Plex Sans', Arial, sans-serif; background: #f9fafb; padding: 40px 0;">
        <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <div style="background: #16a34a; padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Engineering Tutorials</h1>
          </div>
          <div style="padding: 40px 32px;">
            <h2 style="color: #111827; margin: 0 0 16px;">Hello, ${name}!</h2>
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px;">Your one-time verification code is:</p>
            <div style="background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
              <span style="font-size: 40px; font-weight: 700; letter-spacing: 8px; color: #16a34a; font-family: 'IBM Plex Mono', monospace;">${otp}</span>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
          </div>
          <div style="background: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Engineering Tutorials. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendWelcomeEmail(email, name) {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Welcome to Engineering Tutorials!',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background: #f9fafb; padding: 40px 0;">
        <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <div style="background: #16a34a; padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Engineering Tutorials</h1>
          </div>
          <div style="padding: 40px 32px;">
            <h2 style="color: #111827;">Welcome aboard, ${name}! 🎉</h2>
            <p style="color: #4b5563; line-height: 1.6;">Your account has been verified. Start exploring engineering tutorials across all disciplines — from Electrical to Aerospace Engineering.</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="display: inline-block; background: #16a34a; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">Go to Dashboard</a>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendPasswordResetEmail(email, name, resetUrl) {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Reset your Engineering Tutorials password',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background: #f9fafb; padding: 40px 0;">
        <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden;">
          <div style="background: #16a34a; padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0;">Engineering Tutorials</h1>
          </div>
          <div style="padding: 40px 32px;">
            <h2>Reset Your Password</h2>
            <p style="color: #4b5563;">Hello ${name}, click the button below to reset your password. This link expires in 1 hour.</p>
            <a href="${resetUrl}" style="display: inline-block; background: #16a34a; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">Reset Password</a>
            <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendAuthorCreatedEmail(email, name, password) {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Your Engineering Tutorials Author Account',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background: #f9fafb; padding: 40px 0;">
        <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden;">
          <div style="background: #16a34a; padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0;">Engineering Tutorials</h1>
          </div>
          <div style="padding: 40px 32px;">
            <h2>You've been added as an Author</h2>
            <p style="color: #4b5563;">Hello ${name}, an admin has created an author account for you. Here are your credentials:</p>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <p style="margin: 0; color: #374151;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 8px 0 0; color: #374151;"><strong>Temporary Password:</strong> ${password}</p>
            </div>
            <p style="color: #6b7280; font-size: 13px;">Please change your password after first login.</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/login" style="display: inline-block; background: #16a34a; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 8px;">Login Now</a>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendNewsletterWelcome(email, name, unsubToken) {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'You\'re subscribed to Engineering Tutorials Newsletter!',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background: #f9fafb; padding: 40px 0;">
        <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden;">
          <div style="background: #16a34a; padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0;">Engineering Tutorials</h1>
          </div>
          <div style="padding: 40px 32px;">
            <h2>Welcome to our Newsletter${name ? ', ' + name : ''}!</h2>
            <p style="color: #4b5563;">You'll receive the latest tutorials, tips, and updates from the world of engineering.</p>
          </div>
          <div style="background: #f9fafb; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/api/newsletter/unsubscribe?token=${unsubToken}" style="color: #9ca3af; font-size: 12px;">Unsubscribe</a>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
