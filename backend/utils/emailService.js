import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  // Configure your email service here
});

export const sendResetPasswordEmail = async (email, token) => {
  const resetUrl = `http://yourfrontend.com/reset-password?token=${token}`;

  try {
    await transporter.sendMail({
      to: email,
      subject: "Password Reset",
      html: `Click <a href="${resetUrl}">here</a> to reset your password.`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
