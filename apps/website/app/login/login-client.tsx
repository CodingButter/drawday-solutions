'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@raffle-spinner/ui';
import { Input } from '@raffle-spinner/ui';
import { 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Zap, 
  Shield, 
  Users, 
  Trophy,
  Sparkles,
  CheckCircle,
  Star,
  Timer,
  Palette,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginClient() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'magic'>('email');
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const searchParams = useSearchParams();
  const fromRegistration = searchParams?.get('from') === 'registration';

  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const redirectTo = searchParams?.get('from') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push(redirectTo);
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message
        alert(`Magic link sent to ${formData.email}! Please check your email.`);
      } else {
        alert(data.error || 'Failed to send magic link');
      }
    } catch (error) {
      console.error('Magic link error:', error);
      alert('Failed to send magic link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-night text-white flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-night to-blue-900/20">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-[128px] opacity-10 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-[128px] opacity-10 animate-pulse delay-1000" />
        
        <div className="relative z-10 w-full max-w-md">
          {/* Success message from registration */}
          {fromRegistration && mounted && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 animate-in slide-in-from-top-5 duration-500">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-green-400 font-medium">Registration successful!</p>
                  <p className="text-green-300/80 text-sm">Please log in to continue</p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-300 text-lg">
              Continue your journey with DrawDay Solutions
            </p>
          </div>

          {/* Login Method Toggle */}
          <div className="flex rounded-xl bg-gray-800/50 p-1 mb-6 backdrop-blur-sm border border-gray-700/50">
            <button
              className={cn(
                "flex-1 py-3 px-4 rounded-lg transition-all duration-300 text-sm font-medium",
                loginMethod === 'email' 
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg" 
                  : "text-gray-400 hover:text-white"
              )}
              onClick={() => setLoginMethod('email')}
            >
              Email & Password
            </button>
            <button
              className={cn(
                "flex-1 py-3 px-4 rounded-lg transition-all duration-300 text-sm font-medium",
                loginMethod === 'magic' 
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg" 
                  : "text-gray-400 hover:text-white"
              )}
              onClick={() => setLoginMethod('magic')}
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Magic Link
            </button>
          </div>

          {/* Login Form */}
          <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
            {loginMethod === 'email' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10 bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500/20 focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">Remember me</span>
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 text-base font-medium rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="magic-email" className="text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="magic-email"
                      type="email"
                      placeholder="Enter your email for magic link"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 text-base font-medium rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Magic Link...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Send Magic Link
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-400">
                    We'll send you a secure link to sign in instantly
                  </p>
                </div>
              </form>
            )}

          </div>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link 
                href="/register" 
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Benefits & Features */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-900/20 via-gray-900/50 to-blue-900/20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[200px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[200px] opacity-20" />
        
        <div className="relative z-10 p-12 flex flex-col justify-center">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Trusted by 50+ UK Companies
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Power Your Live Draws
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Join the UK's leading raffle companies using our professional draw management platform.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 mb-12">
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Lightning Fast Performance</h3>
                <p className="text-gray-400">Handle 5,000+ participants at 60fps with zero lag</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">UK Gambling Commission Compliant</h3>
                <p className="text-gray-400">Built for transparency and regulatory compliance</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Engaging Viewer Experience</h3>
                <p className="text-gray-400">Professional animations keep audiences captivated</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Custom Branding</h3>
                <p className="text-gray-400">Match your brand with custom themes and logos</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-xl">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                £10M+
              </div>
              <div className="text-gray-400 text-sm">Prizes Drawn</div>
            </div>
            <div className="text-center p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-xl">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                100K+
              </div>
              <div className="text-gray-400 text-sm">Live Viewers</div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-12 p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-xl">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-300 italic mb-4">
              "DrawDay Spinner transformed our live draws. The animations are incredible and our audience engagement has never been higher."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">JD</span>
              </div>
              <div>
                <div className="font-medium text-white">James Davies</div>
                <div className="text-sm text-gray-400">CEO, Elite Competitions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}