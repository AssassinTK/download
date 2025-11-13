import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { UserProfile } from './CharacterSetup';
import { 
  Sword, 
  Wand2, 
  Skull, 
  Target, 
  Shield, 
  Sparkles,
  User,
  Star,
  Zap
} from 'lucide-react';

interface RPGClass {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  bgGradient: string;
  skills: string[];
}

const rpgClasses: RPGClass[] = [
  {
    id: 'warrior',
    name: '戰士',
    icon: <Sword size={32} />,
    description: '勇敢堅毅的前線戰士，擅長面對挑戰和解決問題',
    color: 'text-red-600',
    bgGradient: 'from-red-500 to-orange-500',
    skills: ['領導能力', '問題解決', '團隊合作', '抗壓能力']
  },
  {
    id: 'mage',
    name: '法師',
    icon: <Wand2 size={32} />,
    description: '智慧博學的魔法師，善於創新思維和策略規劃',
    color: 'text-blue-600',
    bgGradient: 'from-blue-500 to-purple-500',
    skills: ['創意思維', '分析能力', '學習能力', '溝通協調']
  },
  {
    id: 'necromancer',
    name: '死靈法師',
    description: '神秘強大的暗影法師，擅長深度分析和專業技能',
    icon: <Skull size={32} />,
    color: 'text-purple-600',
    bgGradient: 'from-purple-500 to-indigo-600',
    skills: ['專業技能', '深度思考', '獨立作業', '細節管理']
  },
  {
    id: 'archer',
    name: '弓箭手',
    icon: <Target size={32} />,
    description: '精準敏捷的遠程專家，注重效率和精確度',
    color: 'text-green-600',
    bgGradient: 'from-green-500 to-teal-500',
    skills: ['精確執行', '效率管理', '目標導向', '技術專精']
  },
  {
    id: 'paladin',
    name: '聖騎士',
    icon: <Shield size={32} />,
    description: '正義守護的神聖戰士，致力於服務他人和維護秩序',
    color: 'text-yellow-600',
    bgGradient: 'from-yellow-500 to-amber-500',
    skills: ['客戶服務', '責任感', '道德操守', '助人為樂']
  },
  {
    id: 'enchanter',
    name: '魅惑師',
    icon: <Sparkles size={32} />,
    description: '魅力非凡的社交專家，擅長人際溝通和團隊協調',
    color: 'text-pink-600',
    bgGradient: 'from-pink-500 to-rose-500',
    skills: ['人際溝通', '魅力領導', '社交協調', '情緒管理']
  }
];

const rpgAvatars = [
  '⚔️', '🛡️', '🏹', '🪄', '⚡', '🔮', '🌟', '💎', '🗝️', '👑', '🦸‍♂️', '🦸‍♀️'
];

interface RPGClassSetupProps {
  initialUser: UserProfile;
  onComplete: (profile: UserProfile) => void;
}

export function RPGClassSetup({ initialUser, onComplete }: RPGClassSetupProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    ...initialUser,
    avatar: '⚔️',
    skills: [],
    bio: ''
  });
  const [selectedClass, setSelectedClass] = useState<RPGClass | null>(null);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    const completeProfile: UserProfile = {
      ...initialUser,
      ...profile,
      name: profile.name || initialUser.name,
      avatar: profile.avatar || '⚔️',
      skills: selectedClass ? selectedClass.skills : (profile.skills || []),
      bio: profile.bio || `我是一名${selectedClass?.name || '冒險者'}，${selectedClass?.description || '準備開始我的培訓之旅！'}`
    };
    onComplete(completeProfile);
  };

  const handleClassSelect = (rpgClass: RPGClass) => {
    setSelectedClass(rpgClass);
    setProfile({
      ...profile,
      skills: rpgClass.skills
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Epic background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      {/* Floating magical particles */}
      <div className="absolute top-20 left-10 text-yellow-400 opacity-60 animate-pulse">
        <Star size={16} fill="currentColor" />
      </div>
      <div className="absolute top-32 right-20 text-blue-400 opacity-40 animate-pulse delay-1000">
        <Zap size={20} fill="currentColor" />
      </div>
      <div className="absolute bottom-32 left-16 text-purple-400 opacity-50 animate-pulse delay-500">
        <Sparkles size={18} fill="currentColor" />
      </div>
      <div className="absolute bottom-20 right-32 text-pink-400 opacity-30 animate-pulse delay-1500">
        <Star size={14} fill="currentColor" />
      </div>

      <Card className="w-full max-w-4xl shadow-2xl border-0 bg-black/40 backdrop-blur-lg text-white">
        <CardHeader className="text-center border-b border-white/10">
          <CardTitle className="flex items-center justify-center space-x-3 text-3xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <User className="text-white" size={28} />
            </div>
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-bold">
              創建你的英雄檔案
            </span>
          </CardTitle>
          <p className="text-gray-300 text-lg mt-2">在這個史詩般的培訓世界中選擇你的命運</p>
          
          {/* Progress indicator */}
          <div className="flex justify-center space-x-3 mt-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                  s === step
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 border-yellow-400 text-black scale-110'
                    : s < step
                    ? 'bg-gradient-to-r from-green-400 to-emerald-400 border-green-400 text-black'
                    : 'border-gray-500 text-gray-500'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">選擇你的職業</h3>
                <p className="text-gray-300">每個職業都有獨特的技能和特質</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rpgClasses.map((rpgClass) => (
                  <div
                    key={rpgClass.id}
                    onClick={() => handleClassSelect(rpgClass)}
                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      selectedClass?.id === rpgClass.id
                        ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 scale-105'
                        : 'border-gray-600 bg-black/20 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${rpgClass.bgGradient} mb-4`}>
                        <div className="text-white">
                          {rpgClass.icon}
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">{rpgClass.name}</h4>
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">{rpgClass.description}</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {rpgClass.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs border-gray-500 text-gray-300">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {selectedClass?.id === rpgClass.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Star size={14} className="text-black" fill="currentColor" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">自定義你的外觀</h3>
                <p className="text-gray-300">選擇代表你的頭像和設定姓名</p>
              </div>

              {/* Avatar selection */}
              <div className="space-y-4">
                <Label className="text-lg text-white">選擇頭像</Label>
                <div className="grid grid-cols-6 gap-4">
                  {rpgAvatars.map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => setProfile({ ...profile, avatar })}
                      className={`w-16 h-16 rounded-xl text-3xl border-2 transition-all duration-300 transform hover:scale-110 ${
                        profile.avatar === avatar
                          ? 'border-yellow-400 bg-yellow-400/20 scale-110'
                          : 'border-gray-600 bg-black/20 hover:border-gray-400'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg text-white">英雄姓名</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="輸入你的英雄姓名"
                  className="bg-black/30 border-gray-600 text-white placeholder:text-gray-400 h-12 text-lg"
                />
              </div>

              {selectedClass && (
                <div className="bg-gradient-to-r from-black/40 to-gray-900/40 rounded-xl p-6 border border-gray-600">
                  <h4 className="text-lg font-bold text-yellow-400 mb-3">已選職業</h4>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${selectedClass.bgGradient}`}>
                      <div className="text-white">{selectedClass.icon}</div>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-white">{selectedClass.name}</h5>
                      <p className="text-gray-300">{selectedClass.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">完成創建</h3>
                <p className="text-gray-300">確認你的英雄設定</p>
              </div>

              {/* Final preview */}
              <div className="bg-gradient-to-br from-black/60 to-gray-900/60 rounded-xl p-8 border border-gray-600">
                <div className="text-center space-y-6">
                  <div className="text-6xl">{profile.avatar}</div>
                  <div>
                    <h4 className="text-3xl font-bold text-white mb-2">{profile.name || '未命名英雄'}</h4>
                    {selectedClass && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-3">
                          <div className={`p-2 rounded-full bg-gradient-to-r ${selectedClass.bgGradient}`}>
                            <div className="text-white scale-75">{selectedClass.icon}</div>
                          </div>
                          <span className="text-xl text-yellow-400 font-bold">{selectedClass.name}</span>
                        </div>
                        <p className="text-gray-300 max-w-md mx-auto">{selectedClass.description}</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {selectedClass.skills.map((skill) => (
                            <Badge key={skill} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-8 border-t border-white/10">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="bg-black/30 border-gray-600 text-white hover:bg-gray-800 px-8 py-3"
            >
              上一步
            </Button>
            
            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={(step === 1 && !selectedClass) || (step === 2 && !profile.name)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-3"
              >
                下一步
              </Button>
            ) : (
              <Button 
                onClick={handleComplete}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black font-bold px-8 py-3"
              >
                開始冒險！
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}