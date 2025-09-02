import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@raffle-spinner/ui';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Chrome, Trophy, Sparkles, LogIn, UserPlus } from 'lucide-react';

interface ExtensionAuthProps {
  onSuccess: () => void;
}

export default function ExtensionAuth({ onSuccess }: ExtensionAuthProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const handleAuthSuccess = () => {
    // Check if we're in the extension context
    if (typeof window !== 'undefined') {
      // Redirect to options page for extension users
      window.location.href = '/live-spinner/options';
    }
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Extension Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-xl border border-purple-500/30 mb-4">
            <Chrome className="h-8 w-8 text-purple-400 mr-2" />
            <Trophy className="h-8 w-8 text-pink-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            DrawDay Spinner
          </h1>
          <p className="text-gray-400 text-sm flex items-center justify-center">
            <Sparkles className="h-4 w-4 mr-1" />
            Chrome Extension for Live Draws
            <Sparkles className="h-4 w-4 ml-1" />
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="flex items-center">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <LoginForm 
                onSuccess={handleAuthSuccess}
                onRegisterClick={() => setActiveTab('register')}
                showMagicLink={true}
              />
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <RegisterForm 
                onSuccess={handleAuthSuccess}
                onLoginClick={() => setActiveTab('login')}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Extension Badge */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Secure Chrome Extension • Trusted by UK Raffles
          </p>
        </div>
      </div>
    </div>
  );
}