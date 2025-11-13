import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Users,
  Star,
  TreePine,
  Crown,
  Shield,
  Sparkles,
  Map,
  ChefHat,
  UserCheck,
  ArrowRight,
  Swords,
  Settings
} from 'lucide-react';
import { UserProfile } from './CharacterSetup';
import { GuildCastle } from './GuildCastle';
import { PeopleDirectory } from './PeopleDirectory';
import { VersionHistory } from './VersionHistory';

interface VillageMapProps {
  currentUser: UserProfile;
  isAdmin: boolean;
  onEnterTrainingPath: (path?: 'indoor' | 'outdoor' | 'newbie' | 'tasks') => void;
  onNavigateToAdmin?: () => void;
}

export function VillageMap({ currentUser, isAdmin, onEnterTrainingPath, onNavigateToAdmin }: VillageMapProps) {
  const [showPeopleDirectory, setShowPeopleDirectory] = useState(false);
  const [showGuildCastle, setShowGuildCastle] = useState(false);

  if (showPeopleDirectory) {
    return (
      <PeopleDirectory 
        currentUser={currentUser} 
        isAdmin={isAdmin}
        onBack={() => setShowPeopleDirectory(false)}
      />
    );
  }

  if (showGuildCastle) {
    return (
      <GuildCastle 
        currentUser={currentUser} 
        isAdmin={isAdmin}
        onBack={() => setShowGuildCastle(false)}
      />
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Mountain silhouettes */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-700/40 to-transparent" 
             style={{
               clipPath: 'polygon(0% 100%, 10% 70%, 20% 85%, 30% 60%, 40% 80%, 50% 50%, 60% 75%, 70% 45%, 80% 70%, 90% 40%, 100% 65%, 100% 100%)'
             }} />
        
        {/* Dark forest elements */}
        <TreePine className="absolute top-12 left-8 text-green-800 opacity-40 transform rotate-12" size={45} />
        <TreePine className="absolute top-24 left-20 text-green-900 opacity-35" size={38} />
        <TreePine className="absolute top-16 right-16 text-green-700 opacity-30 transform -rotate-6" size={42} />
        <TreePine className="absolute bottom-28 left-12 text-green-800 opacity-45" size={50} />
        <TreePine className="absolute bottom-20 right-24 text-green-700 opacity-35 transform rotate-3" size={40} />
        
        {/* Magical floating elements */}
        <Star className="absolute top-16 left-1/4 text-yellow-400 opacity-60 animate-pulse" size={22} fill="currentColor" />
        <Star className="absolute top-32 right-1/3 text-yellow-500 opacity-50 animate-pulse delay-1000" size={18} fill="currentColor" />
        <Star className="absolute bottom-24 left-1/3 text-yellow-400 opacity-55 animate-pulse delay-500" size={20} fill="currentColor" />
        <Sparkles className="absolute top-20 left-2/3 text-blue-400 opacity-40 animate-pulse delay-2000" size={16} />
        <Sparkles className="absolute bottom-40 right-1/4 text-purple-400 opacity-35 animate-pulse delay-1500" size={14} />
      </div>

      {/* Epic header with Guild Order theme */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-slate-900/80 via-purple-900/80 to-slate-900/80 backdrop-blur-sm border-b border-yellow-400/30 p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{currentUser.avatar}</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Guild Order 世界
              </h1>
              <p className="text-sm text-gray-300">
                <span className="text-yellow-400 font-medium">{currentUser.name}</span> • {currentUser.position} • 冒險者的史詩之旅
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Main content - centered grid */}
      <div className="absolute inset-0 pt-24 pb-20 flex items-center justify-center">
        <div className="max-w-4xl w-full px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {/* 新手村 */}
            <Card 
              className="bg-gradient-to-br from-yellow-600/90 to-orange-600/90 border-yellow-400/50 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl"
              onClick={() => onEnterTrainingPath('newbie')}
            >
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="text-white font-bold text-xl mb-2">新手村</h3>
                <p className="text-orange-100 text-sm mb-4">新人培訓與基礎介紹</p>
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                  點擊進入
                </Badge>
              </CardContent>
            </Card>

            {/* 人物廣場 */}
            <Card 
              className="bg-gradient-to-br from-teal-600/90 to-blue-600/90 border-teal-400/50 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl"
              onClick={() => setShowPeopleDirectory(true)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-white font-bold text-xl mb-2">人物廣場</h3>
                <p className="text-blue-100 text-sm mb-4">認識團隊成員與同事</p>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                  點擊進入
                </Badge>
              </CardContent>
            </Card>

            {/* 外場修練 */}
            <Card 
              className="bg-gradient-to-br from-orange-600/90 to-red-600/90 border-orange-400/50 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl"
              onClick={() => onEnterTrainingPath('outdoor')}
            >
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-4">🍽️</div>
                <h3 className="text-white font-bold text-xl mb-2">外場修練</h3>
                <p className="text-red-100 text-sm mb-4">外場服務技能培訓</p>
                <Badge className="bg-red-500/20 text-red-300 border-red-500/50">
                  點擊進入
                </Badge>
              </CardContent>
            </Card>

            {/* 內場修練 */}
            <Card 
              className="bg-gradient-to-br from-red-600/90 to-purple-600/90 border-red-400/50 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl"
              onClick={() => onEnterTrainingPath('indoor')}
            >
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-4">👨‍🍳</div>
                <h3 className="text-white font-bold text-xl mb-2">內場修練</h3>
                <p className="text-purple-100 text-sm mb-4">內場廚藝技能培訓</p>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                  點擊進入
                </Badge>
              </CardContent>
            </Card>

            {/* 任務中心 */}
            <Card 
              className="bg-gradient-to-br from-purple-600/90 to-indigo-600/90 border-purple-400/50 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl"
              onClick={() => onEnterTrainingPath('tasks')}
            >
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-white font-bold text-xl mb-2">任務中心</h3>
                <p className="text-indigo-100 text-sm mb-4">查看培訓進度與成就</p>
                <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/50">
                  點擊進入
                </Badge>
              </CardContent>
            </Card>

            {/* 公會城堡 或 管理中心 */}
            {isAdmin ? (
              <Card 
                className="bg-gradient-to-br from-rose-600/90 to-pink-600/90 border-rose-400/50 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl"
                onClick={onNavigateToAdmin}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">⚙️</div>
                  <h3 className="text-white font-bold text-xl mb-2">管理中心</h3>
                  <p className="text-pink-100 text-sm mb-4">系統管理與用戶設定</p>
                  <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/50">
                    點擊進入
                  </Badge>
                </CardContent>
              </Card>
            ) : (
              <Card 
                className="bg-gradient-to-br from-amber-600/90 to-yellow-600/90 border-amber-400/50 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl"
                onClick={() => setShowGuildCastle(true)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">🏰</div>
                  <h3 className="text-white font-bold text-xl mb-2">公會城堡</h3>
                  <p className="text-yellow-100 text-sm mb-4">Guild Order總部殿堂</p>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                    點擊進入
                  </Badge>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Epic bottom instructions */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <Card className="bg-gradient-to-r from-slate-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-sm border border-yellow-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Swords className="text-yellow-400" size={16} />
              <span className="text-yellow-400 font-bold text-sm">Guild Order 訓練場</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-2">
              從 <span className="text-amber-400 font-medium">🏠 新手村</span> 開始你的冒險，
              選擇 <span className="text-orange-400 font-medium">🍽️ 外場修練道</span> 或 <span className="text-red-400 font-medium">👨‍🍳 內場修練道</span> 精進技能，
              最終登上 <span className="text-yellow-400 font-medium">🏰 公會城堡</span> 的榮耀巔峰！
            </p>
            <div className="flex justify-center">
              <VersionHistory 
                currentVersion="1.03"
                className="text-gray-500 bg-white/10 border-gray-400/20 hover:border-gray-400/40"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}