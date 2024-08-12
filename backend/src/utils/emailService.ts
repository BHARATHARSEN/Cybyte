
import nodemailer from 'nodemailer';

// Email Service
const transporter = nodemailer.createTransport({
  // Configuration
  service: 'Gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendResetPasswordEmail = async (email: string, token: string): Promise<void> => {
  const resetUrl = `http://frontend.com/reset-password?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password Reset',
      html: `Click <a href="${resetUrl}">here</a> to reset your password.`,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};


