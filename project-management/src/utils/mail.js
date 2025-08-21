import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Project Management System",
      link: "https://mailgen.js/",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailGenContent);
  const emailHTML = mailGenerator.generate(options.mailGenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: Number(process.env.MAILTRAP_SMTP_PORT),
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "mail.taskmanager@example.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHTML,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error("Email service failed to send email", error);
  }
};

const emailVerificationTemplate = (username, verificationLink) => {
  return {
    body: {
      name: username,
      intro: "Welcome to the project management system!",
      action: {
        instructions: "To verify your account, please click the button below:",
        button: {
          color: "#1a73e8",
          text: "Verify Account",
          link: verificationLink,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordTemplate = (username, resetPasswordLink) => {
  return {
    body: {
      name: username,
      intro: "You have requested to reset your password for your account.",
      action: {
        instructions: "To reset your password, please click the button below:",
        button: {
          color: "#1a73e8",
          text: "Reset Password",
          link: resetPasswordLink,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export { emailVerificationTemplate, forgotPasswordTemplate, sendEmail };
