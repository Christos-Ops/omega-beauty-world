import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const update = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'At least 6 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) navigate('/');
  };

  const inputClass = (field: keyof Errors) =>
    `input-field pl-10 ${errors[field] ? 'border-rose-400' : ''}`;

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16">
      <div className="text-center">
        <Sparkles className="mx-auto h-12 w-12 text-gold-500" strokeWidth={1.5} />
        <h1 className="mt-4 font-serif text-4xl font-semibold text-royal-900">Join Omega</h1>
        <p className="mt-2 text-royal-500">Create your beauty world account</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-5 rounded-2xl border border-royal-100 bg-white p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-royal-700">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-royal-300" />
              <input
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                placeholder="Jane"
                className={inputClass('firstName')}
              />
            </div>
            {errors.firstName && <p className="mt-1 text-xs text-rose-500">{errors.firstName}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-royal-700">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-royal-300" />
              <input
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                placeholder="Doe"
                className={inputClass('lastName')}
              />
            </div>
            {errors.lastName && <p className="mt-1 text-xs text-rose-500">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-royal-700">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-royal-300" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="you@example.com"
              className={inputClass('email')}
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
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              placeholder="••••••••"
              className={inputClass('password')}
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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-royal-700">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-royal-300" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.confirm}
              onChange={(e) => update('confirm', e.target.value)}
              placeholder="••••••••"
              className={inputClass('confirm')}
            />
          </div>
          {errors.confirm && <p className="mt-1 text-xs text-rose-500">{errors.confirm}</p>}
        </div>

        <button type="submit" className="btn-gold w-full">
          Create Account
        </button>

        <p className="text-center text-sm text-royal-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-gold-600 hover:text-gold-700">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
