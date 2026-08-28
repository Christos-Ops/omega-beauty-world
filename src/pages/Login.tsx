import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!email.includes('@')) errs.email = 'Enter a valid email address';
    if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      navigate('/');
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16">
      <div className="text-center">
        <Sparkles className="mx-auto h-12 w-12 text-gold-500" strokeWidth={1.5} />
        <h1 className="mt-4 font-serif text-4xl font-semibold text-royal-900">Welcome Back</h1>
        <p className="mt-2 text-royal-500">Sign in to your Omega Beauty World account</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-5 rounded-2xl border border-royal-100 bg-white p-8"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-royal-700">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-royal-300" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((er) => ({ ...er, email: undefined }));
              }}
              placeholder="you@example.com"
              className={`input-field pl-10 ${errors.email ? 'border-rose-400' : ''}`}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
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
                setErrors((er) => ({ ...er, password: undefined }));
              }}
              placeholder="••••••••"
              className={`input-field px-10 ${errors.password ? 'border-rose-400' : ''}`}
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
          {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-royal-600">
            <input type="checkbox" className="accent-gold-500" /> Remember me
          </label>
          <a href="#" className="font-medium text-gold-600 hover:text-gold-700">
            Forgot password?
          </a>
        </div>

        <button type="submit" className="btn-gold w-full">
          Sign In
        </button>

        <p className="text-center text-sm text-royal-500">
          Don’t have an account?{' '}
          <Link to="/register" className="font-semibold text-gold-600 hover:text-gold-700">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
