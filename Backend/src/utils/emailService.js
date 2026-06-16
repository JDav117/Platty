const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Platty" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

  return sendEmail({
    to: email,
    subject: 'Recuperación de contraseña - Platty',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #FEC021; margin: 0;">Platty</h1>
          <p style="color: #999; font-size: 14px; margin: 0;">Cocina, postea y saborea</p>
        </div>
        <h2 style="color: #333;">Recupera tu contraseña</h2>
        <p>Has solicitado restablecer tu contraseña en Platty.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #FEC021; color: #604307; text-decoration: none; border-radius: 6px; margin: 16px 0; font-weight: bold;">
          Restablecer contraseña
        </a>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste este cambio, ignora este mensaje.</p>
        <hr>
        <p style="color: #999; font-size: 12px;">Platty - Cocina, postea y saborea</p>
      </div>
    `,
  });
};

const sendOtpEmail = async (email, otpCode) => {
  return sendEmail({
    to: email,
    subject: 'Tu código de verificación - Platty',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #FEC021; margin: 0;">Platty</h1>
          <p style="color: #999; font-size: 14px; margin: 0;">Cocina, postea y saborea</p>
        </div>
        <h2 style="color: #333;">Verifica tu correo electrónico</h2>
        <p>Gracias por registrarte en Platty. Usa el siguiente código para verificar tu cuenta:</p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #FEC021; background: #FFFDF0; padding: 16px 32px; border-radius: 8px; display: inline-block;">${otpCode}</span>
        </div>
        <p>Este código expirará en 10 minutos.</p>
        <p>Si no creaste una cuenta en Platty, ignora este mensaje.</p>
        <hr>
        <p style="color: #999; font-size: 12px;">Platty - Cocina, postea y saborea</p>
      </div>
    `,
  });
};

module.exports = { sendEmail, sendPasswordResetEmail, sendOtpEmail };
