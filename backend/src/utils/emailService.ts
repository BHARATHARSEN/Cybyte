// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   // Configure your email service here
// });

// export const sendResetPasswordEmail = async (email, token) => {
//   const resetUrl = `http://yourfrontend.com/reset-password?token=${token}`;

//   try {
//     await transporter.sendMail({
//       to: email,
//       subject: "Password Reset",
//       html: `Click <a href="${resetUrl}">here</a> to reset your password.`,
//     });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error;
//   }
// };

import nodemailer from 'nodemailer';

// Configure your email service here
const transporter = nodemailer.createTransport({
  // Example configuration, update with your settings
  service: 'Gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendResetPasswordEmail = async (email: string, token: string): Promise<void> => {
  const resetUrl = `http://yourfrontend.com/reset-password?token=${token}`;

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


