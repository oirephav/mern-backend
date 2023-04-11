import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

export const sendEmail = async (emailTemplate) => {
  try {
    const transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: process.env.EMAIL_LOGIN,
          pass: process.env.EMAIL_PASSWORD,
        },
      })
    );

    transporter.sendMail(emailTemplate, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    return error;
  }
};

export const requestResetPasswordTemplate = (user, url) => {
  const from = process.env.EMAIL_LOGIN;
  const to = user.email;
  const subject = "Get to Know UM Password Reset";
  const html = `
  <p>Hey ${user.name || user.email},</p>
  <p>You requested to reset your password.</p>
  <p> Please use the following link to reset your password:</p>
  <a href=${url}>${url}</a>
  <p>If you don’t use this link within 1 hour, it will expire.</p>
  `;

  return { from, to, subject, html };
};

export const resetPasswordSuccessfullyTemplate = (user) => {
  const from = process.env.EMAIL_LOGIN;
  const to = user.email;
  const subject = "Password Reset Successfully";
  const html = `
  <p>Hi ${user.name || user.email},</p>
  <p>Your password has been changed successfully.</p>
  `;

  return { from, to, subject, html };
};