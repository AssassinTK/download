import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Shield, Lock, Users, Star, Crown, Sword, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { VersionHistory } from './VersionHistory';
// use public folder served at project root by Vite (prefer PNG for rich detail)
const guildLogo = '/logo.png';

interface LoginPageProps {
  onLogin: (userId: string, isAdmin: boolean, sessionToken: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (password.length !== 4) {
      toast.error('請輸入4位數密碼');
      return;
    }

    setIsLoading(true);

    try {
      const sessionToken = localStorage.getItem('sessionToken') || undefined;
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ password, sessionToken })
      });

      const result = await response.json();

      if (response.ok) {
        const isAdmin = password === '6032';
        onLogin(result.userId, isAdmin, result.sessionToken);
        toast.success(isAdmin ? '管理員登入成功' : '登入成功');
      } else {
        if (result.code === 'MULTI_DEVICE_LOGIN') {
          toast.error(result.error, {
            duration: 5000,
          });
        } else {
          toast.error(result.error || '登入失敗');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('登入過程發生錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPassword(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Epic background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      {/* Floating magical elements */}
      <div className="absolute top-10 left-10 text-yellow-400 opacity-60 animate-pulse">
        <Star size={32} fill="currentColor" />
      </div>
      <div className="absolute top-20 right-20 text-blue-400 opacity-40 animate-pulse delay-1000">
        <Sparkles size={28} fill="currentColor" />
      </div>
      <div className="absolute bottom-32 left-16 text-purple-400 opacity-50 animate-pulse delay-500">
        <Crown size={24} fill="currentColor" />
      </div>
      <div className="absolute bottom-10 right-32 text-pink-400 opacity-30 animate-pulse delay-1500">
        <Sword size={20} fill="currentColor" />
      </div>
      <div className="absolute top-1/2 left-20 text-emerald-400 opacity-25 animate-pulse delay-2000">
        <Star size={16} fill="currentColor" />
      </div>
      <div className="absolute top-1/3 right-16 text-orange-400 opacity-35 animate-pulse delay-3000">
        <Sparkles size={22} fill="currentColor" />
      </div>

      <Card className="w-full max-w-lg shadow-2xl border-0 bg-black/40 backdrop-blur-lg text-white">
        <CardHeader className="text-center pb-8 border-b border-white/10">
          <div className="mx-auto mb-6">
            <img 
              src={guildLogo} 
              alt="Guild Order Logo" 
              className="w-24 h-24 mx-auto mb-4 drop-shadow-2xl"
            />
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent mb-2">
            Guild Order
          </CardTitle>
          <div className="text-center space-y-2">
            <p className="text-xl text-gray-300 font-medium">冒險者公會</p>
            <p className="text-sm text-gray-400">輸入您的4位數公會密碼進入系統</p>
            <div className="mt-3">

            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 p-8">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400">
                <Shield size={20} />
              </div>
              <Input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                onKeyPress={handleKeyPress}
                placeholder="••••"
                className="pl-12 pr-4 text-center text-2xl tracking-widest h-14 border-2 border-gray-600 bg-black/30 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                maxLength={4}
                autoComplete="off"
              />
            </div>
            <div className="flex justify-center space-x-3 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                    password.length >= i
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 border-yellow-400 scale-125 shadow-lg shadow-yellow-400/50'
                      : 'bg-transparent border-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={password.length !== 4 || isLoading}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 border-2 border-yellow-400/50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin" />
                <span>進入公會中...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Crown size={20} />
                <span>進入公會</span>
              </div>
            )}
          </Button>

          <div className="text-center pt-6 border-t border-white/10">
            <div className="flex items-center justify-center space-x-3 text-sm text-gray-300 mb-3">
              <Users size={18} className="text-yellow-400" />
              <span className="font-medium">冒險者培訓管理系統</span>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-400">
                🗡️ 準備好開始你的冒險之旅了嗎？
              </p>
              <p className="text-xs text-gray-500">
                如忘記密碼，請聯繫公會管理員
              </p>
              <div className="mt-3 flex justify-center">
                <VersionHistory 
                  currentVersion="1.03"
                  className="text-yellow-400 bg-black/20 border-yellow-400/20 hover:border-yellow-400/40"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}