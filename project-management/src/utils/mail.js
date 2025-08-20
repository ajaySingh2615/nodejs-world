import Mailgen from "mailgen";

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

export { emailVerificationTemplate, forgotPasswordTemplate };
