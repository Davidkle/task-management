'use client';

import type React from 'react';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { CheckCircle, Eye, EyeOff } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { dismissToast, showToast } from '@/lib/toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const router = useRouter();

  const LOGIN_FAILED_MESSAGE = 'Login failed';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await authClient.signIn.email(
        {
          email: formData.email,
          password: formData.password,
          callbackURL: '/app',
          rememberMe: formData.rememberMe,
        },
        {
          onRequest: () => {
            showToast({ id: 'login-loading', message: 'Signing you in...', type: 'loading' });
          },
          onSuccess: () => {
            dismissToast('login-loading');
            router.push('/app');
          },
          onError: (ctx) => {
            dismissToast('login-loading');
            showToast({ id: 'login-error', message: ctx.error.message || LOGIN_FAILED_MESSAGE, type: 'error' });
          },
        }
      );
    } catch (err: any) {
      // TODO: Handle catastrophic error
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TaskFlow</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Log into your account to continue</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Login
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              {"Don't have an account? "}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-6">
          Subject to the{' '}
          <Link href="#" className="underline hover:text-gray-700">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="#" className="underline hover:text-gray-700">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
}
