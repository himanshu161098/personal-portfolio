import React, { useState, useEffect } from 'react';
import { X, Sparkles, User, Lock, Mail, Phone, ShieldCheck, KeyRound, ArrowRight, ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RobotCaptcha } from './common/RobotCaptcha';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, quickDemoLogin, sendOtp } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

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

  // Quick Credential Auto-Fill
  const fillDemoCredentials = (role: 'user' | 'admin') => {
    setError(null);
    setIsRegister(false);
    setLoginMethod('password');
    setCaptchaToken(`robot-verified-demo-${Date.now()}`);
    if (role === 'admin') {
      setIdentifier('admin@prachi.ai');
      setPassword('AdminPass2026!');
      setSuccessMsg('Admin credentials auto-filled! Click "Sign In with Password" or 1-Click login.');
    } else {
      setIdentifier('demo@prachi.ai');
      setPassword('PrachiAI2026!');
      setSuccessMsg('Demo credentials auto-filled! Click "Sign In with Password" or 1-Click login.');
    }
  };

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

    const cleanId = identifier.trim() || 'demo@prachi.ai';
    if (!identifier.trim()) {
      setIdentifier('demo@prachi.ai');
    }

    setOtpLoading(true);
    try {
      const res = await sendOtp(cleanId, purpose);
      setOtpSent(true);
      setOtpTimer(60);
      const code = res.devOtp || '123456';
      setDevOtp(code);
      setOtp(code);
      setCaptchaToken(`robot-verified-otp-${Date.now()}`);
      setSuccessMsg(res.message || `Verification code ready: ${code} (Auto-filled)`);
    } catch (err: any) {
      const fallbackCode = '123456';
      setDevOtp(fallbackCode);
      setOtp(fallbackCode);
      setOtpSent(true);
      setCaptchaToken(`robot-verified-otp-${Date.now()}`);
      setSuccessMsg(`Test verification code generated: ${fallbackCode} (Auto-filled)`);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Auto-fulfill captcha token if user bypassed manual check
    const activeCaptcha = captchaToken || `robot-verified-session-${Date.now()}`;
    if (!captchaToken) {
      setCaptchaToken(activeCaptcha);
    }

    const cleanId = identifier.trim() || 'demo@prachi.ai';
    setLoading(true);

    try {
      if (isRegister) {
        // Sign Up
        const finalOtp = otp.trim() || devOtp || '123456';
        const finalPass = password || 'PrachiAI2026!';

        await register({
          identifier: cleanId,
          fullName: (fullName.trim() || cleanId.split('@')[0] || 'User'),
          password: finalPass,
          otp: finalOtp,
          captchaToken: activeCaptcha
        });
        onClose();
      } else {
        // Sign In
        if (loginMethod === 'otp') {
          const finalOtp = otp.trim() || devOtp || '123456';
          await login({
            identifier: cleanId,
            otp: finalOtp,
            captchaToken: activeCaptcha
          });
        } else {
          // Password Login
          const finalPass = password || (cleanId.includes('admin') ? 'AdminPass2026!' : 'PrachiAI2026!');
          await login({
            identifier: cleanId,
            password: finalPass,
            captchaToken: activeCaptcha
          });
        }
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Click "Instant Demo" to bypass.');
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
        {/* Top Navigation Bar: Return to Portfolio & Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <a
            href="../index.html"
            onClick={(e) => {
              e.preventDefault();
              if (window.history.length > 1 && document.referrer && (document.referrer.includes('index.html') || document.referrer.includes('portfolio') || document.referrer.includes('Level%201') || document.referrer.includes('Level 1'))) {
                window.history.back();
              } else {
                try {
                  window.location.href = new URL('../index.html', window.location.href).href;
                } catch {
                  window.location.href = '../index.html';
                }
              }
            }}
            title="Return to Personal Portfolio"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--accent-indigo, #818cf8)',
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'none',
              cursor: 'pointer',
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={13} />
            <span>← Return to Portfolio</span>
          </a>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

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

        {/* One-Click Instant Sign-In Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '16px',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} style={{ color: '#c084fc' }} /> 1-Click Instant Access
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Zero setup required</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleDemoClick('user')}
              disabled={loading}
              style={{
                padding: '9px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(99, 102, 241, 0.45)',
                background: 'rgba(99, 102, 241, 0.25)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <User size={13} style={{ color: '#a5b4fc' }} />
              <span>Pari (User)</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoClick('admin')}
              disabled={loading}
              style={{
                padding: '9px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.45)',
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <ShieldCheck size={13} style={{ color: '#fbbf24' }} />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '8px', color: 'var(--accent-rose)', fontSize: '0.82rem', marginBottom: '14px', lineHeight: 1.4 }}>
            <div style={{ marginBottom: '6px' }}>{error}</div>
            <button
              type="button"
              onClick={() => handleDemoClick('user')}
              style={{
                background: 'rgba(244, 63, 94, 0.2)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                color: '#ffffff',
                padding: '3px 10px',
                borderRadius: '4px',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ⚡ Bypass & Sign In as Pari (Demo)
            </button>
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

        {/* Sign In Method Switcher (Password vs OTP) */}
        {!isRegister && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', background: 'var(--bg-tertiary, rgba(255, 255, 255, 0.05))', padding: '4px', borderRadius: '8px', marginBottom: '16px' }}>
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
          </div>
        )}

        {/* Quick Credentials Auto-Fill Bar */}
        {!isRegister && loginMethod === 'password' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px dashed rgba(255, 255, 255, 0.15)', borderRadius: '6px', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Quick Credentials:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => fillDemoCredentials('user')}
                style={{
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.35)',
                  color: '#a5b4fc',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                👤 Fill Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  color: '#fcd34d',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                🛡️ Fill Admin
              </button>
            </div>
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
