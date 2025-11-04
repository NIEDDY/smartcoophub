import nodemailer from 'nodemailer';
import { config } from '../config';
import { OTPType } from '../lib/enums';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

export class EmailService {
  static async sendOTP(email: string, otp: string, type: OTPType): Promise<void> {
    const subject = type === OTPType.REGISTRATION
      ? 'Verify Your Email - Smart Coop Hub'
      : type === OTPType.PASSWORD_RESET
      ? 'Reset Your Password - Smart Coop Hub'
      : 'Your OTP Code - Smart Coop Hub';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 8px; margin: 20px 0; }
            .otp { font-size: 32px; font-weight: bold; color: #2563eb; text-align: center; letter-spacing: 5px; padding: 20px; background: white; border-radius: 8px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Smart Coop Hub</h1>
            </div>
            <div class="content">
              <h2>Your OTP Code</h2>
              <p>Use the following code to complete your verification:</p>
              <div class="otp">${otp}</div>
              <p>This code will expire in ${config.otp.expiryMinutes} minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Smart Coop Hub. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: config.email.from,
      to: email,
      subject,
      html,
    });
  }

  static async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Smart Coop Hub!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Welcome to Smart Coop Hub - Your digital platform for cooperative management and marketplace.</p>
              <p>We're excited to have you on board! Here's what you can do:</p>
              <ul>
                <li>Manage your cooperative members and finances</li>
                <li>Connect with buyers through our marketplace</li>
                <li>Post job opportunities and announcements</li>
                <li>Generate transparent reports</li>
              </ul>
              <a href="${config.frontend.url}/dashboard" class="button">Go to Dashboard</a>
              <p>If you have any questions, feel free to reach out to our support team.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Smart Coop Hub. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: 'Welcome to Smart Coop Hub!',
      html,
    });
  }

  static async sendInvitationEmail(
    email: string,
    cooperativeName: string,
    role: string,
    inviteLink: string
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .info-box { background: white; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>You're Invited!</h1>
            </div>
            <div class="content">
              <h2>Cooperative Membership Invitation</h2>
              <p>You have been invited to join <strong>${cooperativeName}</strong> on Smart Coop Hub.</p>
              <div class="info-box">
                <p><strong>Your Role:</strong> ${role}</p>
                <p><strong>Cooperative:</strong> ${cooperativeName}</p>
              </div>
              <p>Click the button below to accept the invitation and set up your account:</p>
              <a href="${inviteLink}" class="button">Accept Invitation</a>
              <p><small>This invitation link will expire in 7 days.</small></p>
              <p>If you didn't expect this invitation, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Smart Coop Hub. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: `Invitation to Join ${cooperativeName} - Smart Coop Hub`,
      html,
    });
  }

  static async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 30px; background: #ef4444; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>We received a request to reset your password. Click the button below to proceed:</p>
              <a href="${resetLink}" class="button">Reset Password</a>
              <p><small>This link will expire in 1 hour.</small></p>
              <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Smart Coop Hub. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: 'Password Reset - Smart Coop Hub',
      html,
    });
  }
}