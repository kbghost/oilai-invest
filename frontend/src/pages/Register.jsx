import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ui/ThemeToggle';
import PhoneInput from '../components/ui/PhoneInput';
import { WORLD_COUNTRIES, getCountryByCode } from '../data/countries';
import { detectUserCountry } from '../utils/countryDetection';
import { referralAPI } from '../services/api';
import { Eye, EyeOff, Zap, ArrowRight, Check, X, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: searchParams.get('ref') || '',
  });

  const [selectedCountry, setSelectedCountry] = useState(WORLD_COUNTRIES[0]);
  const [detectedCountryInfo, setDetectedCountryInfo] = useState(null);
  const [phoneRaw, setPhoneRaw] = useState('');
  const [phoneValidation, setPhoneValidation] = useState({ isValid: false, e164: '', countryCode: 'BJ' });

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refStatus, setRefStatus] = useState(null); // null | 'checking' | {valid, name} | {valid:false}

  // Automatic country detection on load
  useEffect(() => {
    let isMounted = true;
    detectUserCountry().then(({ country, method }) => {
      if (isMounted && country) {
        setDetectedCountryInfo({ country, method });
        setSelectedCountry(country);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };

  const handlePhoneChange = (val) => {
    setPhoneRaw(val);
  };

  // Referral code real-time verification with debounce
  useEffect(() => {
    const code = form.referralCode.trim().toUpperCase();
    if (!code || code.length < 6) {
      setRefStatus(null);
      return;
    }
    setRefStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const r = await referralAPI.verifyCode(code);
        setRefStatus({ valid: true, name: r.data.referrer.name });
      } catch {
        setRefStatus({ valid: false });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [form.referralCode]);

  const submit = async (e) => {
    e.preventDefault();

    if (!phoneRaw || phoneRaw.trim() === '') {
      return toast.error('Please enter your phone number.');
    }

    if (!phoneValidation.isValid) {
      return toast.error(`Invalid phone number for: ${selectedCountry.name}`);
    }

    if (form.password.length < 6) return toast.error('Password: Minimum 6 characters required');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (refStatus && refStatus !== 'checking' && refStatus.valid === false) return toast.error('Invalid referral code');

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      if (payload.referralCode) payload.referralCode = payload.referralCode.trim().toUpperCase();
      else delete payload.referralCode;

      // E.164 phone format and country code
      payload.phone = phoneValidation.e164 || phoneRaw;
      payload.phoneCountry = selectedCountry.code;
      payload.country = selectedCountry.name;

      await register(payload);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left panel (Desktop) */}
      <div className="auth-left">
        <img src="/images/register_bg.png" alt="Register Background" className="auth-bg-img" />
        <div className="auth-bg-overlay" />
        <div className="auth-left-content">
          <Link to="/" className="auth-logo-link">
            <div className="auth-logo-icon">
              <Zap size={18} color="#fff" />
            </div>
            <span className="auth-logo-text" style={{ color: '#000' }}>
              <span style={{ color: '#000' }}>OilAI</span> <span className="auth-logo-accent" style={{ color: '#16A34A' }}>Invest</span>
            </span>
          </Link>

          <div className="animate-fade-up">
            <h2
              style={{
                fontFamily: '"Poppins",sans-serif',
                fontSize: '2.4rem',
                fontWeight: 800,
                color: '#000',
                marginBottom: '1.5rem',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}
            >
              Join<br />
              <span className="gradient-text">18,000+ investors</span><br />
              worldwide
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: 320 }}>
              {[
                ['$124M+', 'Assets Managed'],
                ['12%/day', 'Max ROI'],
                ['190+', 'Countries Supported'],
                ['24/7', 'AI Support'],
              ].map(([v, l], i) => (
                <div
                  key={l}
                  className={`animate-fade-up stagger-${i + 1}`}
                  style={{
                    padding: '1rem',
                    background: 'rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 16,
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <p style={{ fontFamily: '"Poppins",sans-serif', fontWeight: 800, color: '#000', fontSize: '1.25rem' }}>{v}</p>
                  <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)', fontWeight: 600 }}>© 2025 OilAI Invest</p>
        </div>
      </div>

      {/* Form */}
      <div className="auth-right">
        <div className="auth-mobile-header">
          <Link to="/" className="auth-logo-link">
            <div className="auth-logo-icon" style={{ width: 32, height: 32 }}>
              <Zap size={15} color="#fff" />
            </div>
            <span className="auth-logo-text" style={{ fontSize: '1.1rem' }}>
              <span style={{ color: 'var(--text-primary)' }}>OilAI</span>{' '}
              <span style={{ color: 'var(--accent)' }}>Invest</span>
            </span>
          </Link>
          <ThemeToggle compact />
        </div>

        <div className="auth-card animate-fade-up stagger-1" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h1
              style={{
                fontFamily: '"Poppins",sans-serif',
                fontSize: '1.65rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Create an Account
            </h1>
            <div style={{ display: 'none' }} className="desktop-theme-toggle">
              <ThemeToggle compact />
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: '1.25rem' }}>
            Free registration — ready in 2 minutes
          </p>

          {/* ── DISCREET AUTOMATIC COUNTRY DETECTION BANNER ── */}
          {detectedCountryInfo && (
            <div
              style={{
                padding: '0.65rem 0.85rem',
                background: 'rgba(0, 212, 160, 0.08)',
                border: '1px solid rgba(0, 212, 160, 0.2)',
                borderRadius: 12,
                fontSize: 12,
                color: 'var(--text-secondary)',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                lineHeight: 1.4,
              }}
            >
              <Globe size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
              <div>
                <span>🌍 Automatically detected country: </span>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {detectedCountryInfo.country.name} {detectedCountryInfo.country.flag}
                </strong>
                . You can change this selection if needed.
              </div>
            </div>
          )}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            <div className="auth-grid">
              <div>
                <label className="label">First Name</label>
                <input name="firstName" required value={form.firstName} onChange={handle} className="input" placeholder="e.g. John" />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input name="lastName" required value={form.lastName} onChange={handle} className="input" placeholder="e.g. Doe" />
              </div>
            </div>

            <div>
              <label className="label">Email Address</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handle}
                className="input"
                placeholder="e.g. john.doe@example.com"
              />
            </div>

            {/* ── WORLDWIDE PHONE INPUT ── */}
            <div>
              <PhoneInput
                selectedCountry={selectedCountry}
                onCountryChange={handleCountryChange}
                phoneValue={phoneRaw}
                onPhoneChange={handlePhoneChange}
                onValidationChange={setPhoneValidation}
                detectedCountryName={detectedCountryInfo?.country?.name}
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={show ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={handle}
                  className="input"
                  style={{ paddingRight: 48 }}
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    padding: 4,
                  }}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  name="confirmPassword"
                  type={show ? 'text' : 'password'}
                  required
                  value={form.confirmPassword}
                  onChange={handle}
                  className="input"
                  style={{ paddingRight: 48 }}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    padding: 4,
                  }}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Referral code */}
            <div>
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                🎁 Referral Code
                <span style={{ fontSize: 9, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 0 }}>
                  (optional)
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name="referralCode"
                  value={form.referralCode}
                  onChange={handle}
                  className="input"
                  placeholder="e.g. OILAI-XXXXXX"
                  maxLength={12}
                  style={{
                    paddingRight: 44,
                    fontFamily: 'monospace',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                />
                {refStatus === 'checking' && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 16,
                      height: 16,
                      border: '2.5px solid var(--border)',
                      borderTopColor: 'var(--accent)',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                )}
                {refStatus && refStatus !== 'checking' && refStatus.valid && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'var(--green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 10px rgba(45,212,191,0.4)',
                    }}
                  >
                    <Check size={12} color="#fff" strokeWidth={3} />
                  </div>
                )}
                {refStatus && refStatus !== 'checking' && !refStatus.valid && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'var(--red)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={12} color="#fff" strokeWidth={3} />
                  </div>
                )}
              </div>

              {refStatus?.valid && (
                <div
                  className="animate-fade-up"
                  style={{
                    marginTop: 8,
                    padding: '0.6rem 0.875rem',
                    background: 'rgba(34,197,94,0.1)',
                    border: '1px solid rgba(34,197,94,0.2)',
                    borderRadius: 12,
                    fontSize: 12,
                    color: 'var(--green)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Check size={14} strokeWidth={3} /> Valid referrer: {refStatus.name}
                </div>
              )}
              {refStatus && !refStatus.valid && refStatus !== 'checking' && (
                <p className="animate-fade-up" style={{ marginTop: 6, fontSize: 11, color: 'var(--red)' }}>
                  Referral code not found
                </p>
              )}
            </div>

            <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 4 }}>
              By registering, you agree to our Terms of Service and Privacy Policy.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '0.5rem', fontSize: '1rem' }}
            >
              {loading ? (
                <div
                  style={{
                    width: 22,
                    height: 22,
                    border: '2.5px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
              ) : (
                <>
                  <span>Create My Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none', marginLeft: 4 }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
