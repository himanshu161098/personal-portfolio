import React, { useState, useEffect } from 'react';
import { X, Sparkles, User, Lock, Mail, Phone, ShieldCheck, KeyRound, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RobotCaptcha } from './common/RobotCaptcha';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, quickDemoLogin, sendOtp } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('otp');

  // Form Fields
  const [identifier, setIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // OTP Sending States
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState<number>(0);

  // General States
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // OTP Countdown timer
  useEffect(() => {
    let interval: any = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpTimer]);

  // Reset verification states when switching mode
  const switchMode = (toRegister: boolean) => {
    setIsRegister(toRegister);
    setError(null);
    setSuccessMsg(null);
    setOtp('');
    setOtpSent(false);
    setDevOtp(null);
    setCaptchaToken(null);
  };

  const handleSendOtp = async (purpose: 'register' | 'login') => {
    setError(null);
    setSuccessMsg(null);

    const cleanId = identifier.trim();
    if (!cleanId) {
      setError('Please enter your mobile number or email address first');
      return;
    }

    if (cleanId.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanId)) {
      setError('Please enter a valid email address (e.g. name@example.com)');
      return;
    }

    setOtpLoading(true);
    try {
      const res = await sendOtp(cleanId, purpose);
      setOtpSent(true);
      setOtpTimer(60); // 60s cooldown for resend
      if (res.devOtp) {
        setDevOtp(res.devOtp);
        setOtp(res.devOtp); // Auto-fill test verification code
      }
      setSuccessMsg(
        res.message || `Verification code sent to ${cleanId}! ${
          res.devOtp ? `(Test Code: ${res.devOtp})` : ''
        }`
      );
    } catch (err: any) {
      setError(err.message || 'Failed to send verification OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // 1. Mandatory Robot CAPTCHA Verification
    if (!captchaToken) {
      setError("Please complete the 'I'm not a robot' verification checkbox before proceeding.");
      return;
    }

    const cleanId = identifier.trim();
    if (!cleanId) {
      setError('Please provide your mobile number or email address');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        // Sign Up (Mandatory OTP + Mandatory CAPTCHA)
        if (!otp.trim()) {
          throw new Error('Please enter the 6-digit OTP sent to your mobile or email');
        }
        if (!password || password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }

        await register({
          identifier: cleanId,
          fullName: fullName.trim(),
          password,
          otp: otp.trim(),
          captchaToken
        });
        onClose();
      } else {
        // Sign In
        if (loginMethod === 'otp') {
          // OTP Login
          if (!otp.trim()) {
            throw new Error('Please enter the 6-digit OTP code sent to your mobile or email');
          }
          await login({
            identifier: cleanId,
            otp: otp.trim(),
            captchaToken
          });
        } else {
          // Password Login
          if (!password) {
            throw new Error('Please enter your account password');
          }
          await login({
            identifier: cleanId,
            password,
            captchaToken
          });
        }
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (role: 'user' | 'admin') => {
    setError(null);
    setLoading(true);
    try {
      await quickDemoLogin(role);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isEmail = identifier.includes('@');

  return (
    <div className="modal-backdrop" style={{ zIndex: 1100 }}>
      <div className="modal-dialog" style={{ maxWidth: '440px', width: '92%', maxHeight: '90vh', overflowY: 'auto' }}>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ position: 'absolute', top: '18px', right: '18px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div className="brand-logo-icon" style={{ width: '34px', height: '34px', padding: '2px', background: 'transparent', boxShadow: 'none' }}>
            <img
              src="./assets/prachi-logo.png"
              alt="Prachi AI"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                if (!el.src.includes('prachi-logo.svg')) {
                  el.src = './assets/prachi-logo.svg';
                }
              }}
            />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {isRegister ? 'Create Prachi AI Account' : 'Sign in to Prachi AI'}
          </h2>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          {isRegister
            ? 'Sign up with your mobile number or email ID with instant OTP verification.'
            : 'Access your private AI assistant using password or OTP verification.'}
        </p>

        {/* Alerts */}
        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '8px', color: 'var(--accent-rose)', fontSize: '0.82rem', marginBottom: '14px', lineHeight: 1.4 }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#10b981', fontSize: '0.82rem', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
            {devOtp && (
              <button
                type="button"
                onClick={() => setOtp(devOtp)}
                style={{
                  background: 'rgba(16, 185, 129, 0.25)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#ffffff',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Auto-Fill
              </button>
            )}
          </div>
        )}

        {/* Sign In Method Switcher (OTP vs Password) */}
        {!isRegister && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', background: 'var(--bg-tertiary, rgba(255, 255, 255, 0.05))', padding: '4px', borderRadius: '8px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => { setLoginMethod('otp'); setError(null); }}
              style={{
                padding: '8px 10px',
                borderRadius: '6px',
                border: 'none',
                background: loginMethod === 'otp' ? 'var(--accent-indigo, #6366f1)' : 'transparent',
                color: loginMethod === 'otp' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: loginMethod === 'otp' ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none'
              }}
            >
              <KeyRound size={14} />
              <span>📱 OTP Login</span>
            </button>
            <button
              type="button"
              onClick={() => { setLoginMethod('password'); setError(null); }}
              style={{
                padding: '8px 10px',
                borderRadius: '6px',
                border: 'none',
                background: loginMethod === 'password' ? 'var(--accent-indigo, #6366f1)' : 'transparent',
                color: loginMethod === 'password' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: loginMethod === 'password' ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none'
              }}
            >
              <Lock size={14} />
              <span>🔑 Password Login</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexFlow: 'column', gap: '12px' }}>
          {/* Full Name for Registration */}
          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  className="input-control"
                  placeholder="e.g. Pari Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Identifier (Email or Mobile) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Mobile Number or Email
              </label>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-indigo, #818cf8)' }}>
                {isEmail ? '✉ Email Mode' : '📱 Mobile Mode'}
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="input-control"
                placeholder="e.g. +91 98765 43210 or pari@example.com"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setOtpSent(false);
                }}
              />
            </div>
          </div>

          {/* Password Field (Always in Register; In Login if method === 'password') */}
          {(isRegister || loginMethod === 'password') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {isRegister ? 'Set Password' : 'Password'}
                </label>
                {isRegister && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Min. 6 chars</span>
                )}
              </div>
              <input
                type="password"
                required
                className="input-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {/* OTP Verification Section (Mandatory in Register; In Login if method === 'otp') */}
          {(isRegister || loginMethod === 'otp') && (
            <div style={{ background: 'var(--bg-tertiary, rgba(255, 255, 255, 0.03))', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {isRegister ? 'Mandatory OTP Verification' : '6-Digit Verification Code'}
                </label>
                {otpSent && devOtp && (
                  <button
                    type="button"
                    onClick={() => setOtp(devOtp)}
                    title="Click to fill code"
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      color: '#10b981',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      cursor: 'pointer'
                    }}
                  >
                    Code: {devOtp} (Click to fill)
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  maxLength={6}
                  required
                  className="input-control"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{ letterSpacing: '2px', fontWeight: 600, fontSize: '0.95rem' }}
                />
                <button
                  type="button"
                  onClick={() => handleSendOtp(isRegister ? 'register' : 'login')}
                  disabled={otpLoading || otpTimer > 0}
                  className="btn btn-secondary"
                  style={{ whiteSpace: 'nowrap', fontSize: '0.78rem', padding: '0 12px' }}
                >
                  {otpLoading ? (
                    'Sending...'
                  ) : otpTimer > 0 ? (
                    `Resend (${otpTimer}s)`
                  ) : otpSent ? (
                    'Resend OTP'
                  ) : (
                    'Get OTP'
                  )}
                </button>
              </div>

              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px', marginBottom: 0 }}>
                {isRegister
                  ? 'Click "Get OTP" to receive a verification code on your mobile/email.'
                  : 'Enter the code sent to your registered mobile number or email.'}
              </p>
            </div>
          )}

          {/* Interactive "I'm not a robot" CAPTCHA Checkbox (Mandatory for ALL flows) */}
          <div>
            <RobotCaptcha
              onVerify={(token) => {
                setCaptchaToken(token);
                if (token) setError(null);
              }}
              isVerified={Boolean(captchaToken)}
            />
          </div>

          {/* Action Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              marginTop: '4px',
              padding: '10px 14px',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : isRegister ? (
              <>
                <span>Complete Registration & Sign In</span>
                <ArrowRight size={15} />
              </>
            ) : loginMethod === 'otp' ? (
              <>
                <span>Verify OTP & Sign In</span>
                <ArrowRight size={15} />
              </>
            ) : (
              <>
                <span>Sign In with Password</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Instant Demo Quick Access */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>OR INSTANT DEMO LOGIN</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleDemoClick('user')}
            disabled={loading}
            style={{ fontSize: '0.78rem', padding: '8px' }}
          >
            <User size={13} style={{ color: 'var(--accent-indigo)' }} />
            <span>Pari (User)</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleDemoClick('admin')}
            disabled={loading}
            style={{ fontSize: '0.78rem', padding: '8px' }}
          >
            <ShieldCheck size={13} style={{ color: 'var(--accent-amber)' }} />
            <span>Admin Demo</span>
          </button>
        </div>

        {/* Toggle Mode Footer */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => switchMode(!isRegister)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-indigo)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isRegister
              ? 'Already have an account? Sign In'
              : "Don't have an account? Create one with OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};
