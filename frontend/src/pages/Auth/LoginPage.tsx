import { useState } from "react";
import type { FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { requestOtp, verifyOtp } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState(auth.emailForOtp ?? "");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "otp">(auth.emailForOtp ? "otp" : "email");
  const navigate = useNavigate();

  const handleRequestOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await dispatch(requestOtp(email)).unwrap();
    setStep("otp");
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    await dispatch(verifyOtp({ email, code })).unwrap();
    navigate("/products");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Login with OTP</h1>

        {step === "email" && (
          <form onSubmit={handleRequestOtp} className="auth-form">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button className="auth-btn" type="submit" disabled={auth.status === "loading"}>
              {auth.status === "loading" ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <p className="otp-info">OTP sent to <strong>{email}</strong></p>

            <label className="auth-label">Enter OTP</label>
            <input
              className="auth-input"
              type="text"
              maxLength={6}
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />

            <button className="auth-btn" type="submit" disabled={auth.status === "loading"}>
              {auth.status === "loading" ? "Verifying..." : "Verify & Login"}
            </button>
          </form>
        )}

        {auth.error && <p className="error-text">{auth.error}</p>}
      </div>
    </div>
  );
}
