import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { cn } from '@/shared/lib/cn';
import type { LoginCredentials } from '../api/authApi';

const schema = z.object({
  email: z.string().min(1, 'Email is required.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type SignInValues = z.infer<typeof schema>;

const INPUT =
  'w-full rounded-xl border border-field bg-surface-muted px-4 py-3 text-sm text-ink transition-all placeholder:text-ink-subtle focus:border-brand focus:bg-surface focus:shadow-[0_0_0_4px_rgb(112_48_159_/_0.06)] focus:outline-none';

interface SignInFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  error?: string | null;
}

export function SignInForm({ onSubmit, error }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-800">
          Email
        </label>
        <input id="email" type="email" autoComplete="email" placeholder="Enter your email" className={INPUT} {...register('email')} />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-800">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            className={cn(INPUT, 'pr-12')}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-3 w-full rounded-xl bg-linear-135 from-brand to-brand-600 py-3.5 text-[0.9375rem] font-semibold text-white shadow-[0_8px_16px_-4px_rgb(112_48_159_/_0.3)] transition-all duration-300 ease-control hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-5px_rgb(112_48_159_/_0.4)] disabled:pointer-events-none disabled:opacity-70"
      >
        {isSubmitting ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
}
