import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CircleDollarSign, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserRole } from '../../types';

// ── Password strength helper ──────────────────────────────────────────────────
function usePasswordStrength(password: string) {
  return useMemo(() => {
    if (!password) return { score: 0, label: '', color: '', barColor: '' };

    let score = 0;
    if (password.length >= 8)          score++;
    if (/[A-Z]/.test(password))        score++;
    if (/[0-9]/.test(password))        score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const map = [
      { label: '',         color: 'text-gray-400',   barColor: 'bg-gray-300'   },
      { label: 'Weak',     color: 'text-red-500',    barColor: 'bg-red-500'    },
      { label: 'Fair',     color: 'text-yellow-500', barColor: 'bg-yellow-400' },
      { label: 'Good',     color: 'text-blue-500',   barColor: 'bg-blue-500'   },
      { label: 'Strong',   color: 'text-green-600',  barColor: 'bg-green-500'  },
    ];

    return { score, ...map[score] };
  }, [password]);
}

// ── Password rule row ─────────────────────────────────────────────────────────
const Rule: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
  <li className={`flex items-center gap-1.5 text-xs transition-colors
    ${met ? 'text-green-600' : 'text-gray-400'}`}>
    <CheckCircle size={12} className={met ? 'text-green-500' : 'text-gray-300'} />
    {text}
  </li>
);

// ── Component ─────────────────────────────────────────────────────────────────
export const RegisterPage: React.FC = () => {
  const [name, setName]                     = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole]                     = useState<UserRole>('entrepreneur');
  const [error, setError]                   = useState<string | null>(null);
  const [isLoading, setIsLoading]           = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();
  const strength     = usePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (strength.score < 2) {
      setError('Please choose a stronger password.');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password, role);
      navigate(role === 'entrepreneur'
        ? '/dashboard/entrepreneur'
        : '/dashboard/investor');
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-md flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join Business Nexus to connect with partners
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

          {error && (
            <div className="mb-4 bg-red-50 border border-red-400 text-red-700
                            px-4 py-3 rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I am registering as a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setRole('entrepreneur')}
                  className={`py-3 px-4 border rounded-md flex items-center justify-center
                    transition-colors ${role === 'entrepreneur'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  <Building2 size={18} className="mr-2" />
                  Entrepreneur
                </button>
                <button type="button" onClick={() => setRole('investor')}
                  className={`py-3 px-4 border rounded-md flex items-center justify-center
                    transition-colors ${role === 'investor'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  <CircleDollarSign size={18} className="mr-2" />
                  Investor
                </button>
              </div>
            </div>

            <Input label="Full name" type="text" value={name}
              onChange={e => setName(e.target.value)}
              required fullWidth startAdornment={<User size={18} />} />

            <Input label="Email address" type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              required fullWidth startAdornment={<Mail size={18} />} />

            {/* Password + strength meter */}
            <div>
              <Input label="Password" type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                required fullWidth startAdornment={<Lock size={18} />} />

              {password && (
                <div className="mt-2 space-y-2">
                  {/* Bar */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300
                          ${i <= strength.score ? strength.barColor : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  {/* Label */}
                  <p className={`text-xs font-medium ${strength.color}`}>
                    Password strength: {strength.label}
                  </p>
                  {/* Rules checklist */}
                  <ul className="space-y-0.5">
                    <Rule met={password.length >= 8}          text="At least 8 characters" />
                    <Rule met={/[A-Z]/.test(password)}        text="One uppercase letter" />
                    <Rule met={/[0-9]/.test(password)}        text="One number" />
                    <Rule met={/[^A-Za-z0-9]/.test(password)} text="One special character" />
                  </ul>
                </div>
              )}
            </div>

            <Input label="Confirm password" type="password" value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required fullWidth startAdornment={<Lock size={18} />} />

            {/* Passwords match indicator */}
            {confirmPassword && (
              <p className={`text-xs font-medium -mt-4 ${
                password === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}

            <div className="flex items-center">
              <input id="terms" type="checkbox" required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500
                           border-gray-300 rounded" />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Create account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login"
                className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};