import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendOtp(email: string, code: string) {
    await this.resend.emails.send({
      from: "GroKart <onboarding@resend.dev>",
      to: email,
      subject: "Your OTP Code",
      html: `<h1>OTP: ${code}</h1>`,
    });
  }
}
