'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { Car, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Voer een geldig e-mailadres in'),
  password: z.string().min(6, 'Wachtwoord moet minimaal 6 tekens bevatten'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      setAuth(response.data.data);
      toast.success('Welkom terug! 👋');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Inloggen mislukt');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4 animate-float">
              <Car className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaxiBoek
            </h1>
            <p className="text-gray-500 mt-2">Beheer je boekhouding eenvoudig</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mailadres
              </label>
              <div className="relative">
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="naam@email.nl"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wachtwoord
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-shine flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Even geduld...
                </>
              ) : (
                <>
                  Inloggen
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Nog geen account?{' '}
              <Link
                href="/registreren"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Registreer gratis
              </Link>
            </p>
          </div>

          {/* Demo hint */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-700 text-center">
              <strong>Demo:</strong> demo@taxiboek.nl / demo123
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          © 2026 TaxiBoek. Alle rechten voorbehouden.
        </p>
      </div>
    </div>
  );
}
