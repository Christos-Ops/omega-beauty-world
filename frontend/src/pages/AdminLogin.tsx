import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const ADMIN_EMAIL = 'admin@omegabeauty.com';
const ADMIN_PASSWORD = 'admin123';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('omega_admin_session', 'true');
      navigate('/admin');
      return;
    }

    setError('Invalid admin credentials. Use the demo login below.');
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16">
      <div className="text-center">
        <ShieldCheck className="mx-auto h-12 w-12 text-gold-500" strokeWidth={1.5} />
        <h1 className="mt-4 font-serif text-4xl font-semibold text-royal-900">Admin Access</h1>
        <p className="mt-2 text-royal-500">Secure area for store management</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-5 rounded-2xl border border-royal-100 bg-white p-8 shadow-sm"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-royal-700">Admin email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-royal-300" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="admin@omegabeauty.com"
              className="input-field pl-10"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-royal-700">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-royal-300" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="••••••••"
              className="input-field px-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-royal-300 hover:text-royal-600"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-rose-500">{error}</p>}

        <button type="submit" className="btn-gold w-full">
          Enter dashboard
        </button>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <p className="font-semibold">Demo admin login</p>
          <p>Email: {ADMIN_EMAIL}</p>
          <p>Password: {ADMIN_PASSWORD}</p>
        </div>

        <p className="text-center text-sm text-royal-500">
          Return to the{' '}
          <Link to="/" className="font-semibold text-gold-600 hover:text-gold-700">
            storefront
          </Link>
        </p>
      </form>
    </div>
  );
}
