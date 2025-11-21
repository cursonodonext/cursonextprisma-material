import nodemailer from "nodemailer";

// Configurar el transporter con tus credenciales SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // true para 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Función para enviar email de recuperación de contraseña
export async function sendPasswordResetEmail(email, resetLink) {
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || "Tu App"}" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Recuperación de Contraseña",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 30px; }
            .button { 
              display: inline-block; 
              padding: 12px 30px; 
              background-color: #4F46E5; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Recuperación de Contraseña</h1>
            </div>
            <div class="content">
              <p>Hola,</p>
              <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
              <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
              <div style="text-align: center;">
                <a href="${resetLink}" class="button">Restablecer Contraseña</a>
              </div>
              <p>O copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; color: #4F46E5;">${resetLink}</p>
              <p><strong>Este enlace expirará en 1 hora.</strong></p>
              <p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
            </div>
            <div class="footer">
              <p>Este es un correo automático, por favor no respondas.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Recuperación de Contraseña
      
      Recibimos una solicitud para restablecer la contraseña de tu cuenta.
      
      Haz clic en el siguiente enlace para crear una nueva contraseña:
      ${resetLink}
      
      Este enlace expirará en 1 hora.
      
      Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email enviado:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error al enviar email:", error);
    throw error;
  }
}

// Función para verificar la configuración
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log("✅ Configuración de email válida");
    return true;
  } catch (error) {
    console.error("❌ Error en configuración de email:", error);
    return false;
  }
}
