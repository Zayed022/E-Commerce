import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpCode } from './otp.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(OtpCode)
    private readonly otpRepo: Repository<OtpCode>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  }

  async requestOtp(email: string): Promise<void> {
  const code = this.generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
  const otp = this.otpRepo.create({ email, code, expiresAt });
  await this.otpRepo.save(otp);

  await this.emailService.sendOtp(email, code);
}


  async verifyOtp(email: string, code: string) {
    const otp = await this.otpRepo.findOne({
      where: { email, code, consumed: false },
      order: { createdAt: 'DESC' },
    });

    if (!otp || otp.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    otp.consumed = true;
    await this.otpRepo.save(otp);

    let user = await this.usersService.findByEmail(email);
    if (!user) {
      user = await this.usersService.create({ email });
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken, user };
  }
}
