import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthHero from '../components/AuthHero';
import RegisterForm from '../components/RegisterForm';
import '../styles/base.css';
import '../styles/auth.css';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    // ── client-side validation ──────────────────────────────
    const x = {};
    if (!firstName.trim()) x.rF = 'This field is required.';
    if (!lastName.trim())  x.rL = 'This field is required.';
    if (!email.trim())     x.rE = 'This field is required.';
    if (!password)         x.rP = 'This field is required.';

    const em = email.trim().toLowerCase();
    if (!x.rE && !/^\S+@\S+\.\S+$/.test(em))
      x.rE = 'Enter a valid email.';
    if (!x.rP && password.length < 6)
      x.rP = 'Use at least 6 characters.';

    if (Object.keys(x).length) { setErrors(x); return; }

    setLoading(true);
    setErrors({});

    try {
      // Step 1 — send OTP via Express backend
      const otpRes  = await fetch('/otp/send', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: em }),
      });
      const otpData = await otpRes.json();

      if (!otpRes.ok) {
        setErrors({ rE: otpData.error || 'Failed to send verification code.' });
        setLoading(false);
        return;
      }

      // Step 2 — stash registration data for OTP page
      sessionStorage.setItem('3a_reg', JSON.stringify({
        first_name: firstName.trim(),
        last_name:  lastName.trim(),
        email:      em,
        password,
      }));

      navigate('/otp');
    } catch {
      setErrors({ rE: 'Cannot reach the server. Make sure the backend is running.' });
      setLoading(false);
    }
  }

  return (
    <div className="split">
      <AuthHero
        title="Create your account in a minute."
        subtitle="One account per customer. We email you a 6-digit code to verify it."
      />
      <RegisterForm
        firstName={firstName}
        setFirstName={v => { setFirstName(v); setErrors(x => ({ ...x, rF: '' })); }}
        lastName={lastName}
        setLastName={v => { setLastName(v); setErrors(x => ({ ...x, rL: '' })); }}
        email={email}
        setEmail={v => { setEmail(v); setErrors(x => ({ ...x, rE: '' })); }}
        password={password}
        setPassword={v => { setPassword(v); setErrors(x => ({ ...x, rP: '' })); }}
        errors={errors}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
