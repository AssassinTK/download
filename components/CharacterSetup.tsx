import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Camera, User, Briefcase, Heart, Star } from 'lucide-react';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  position: string;
  virtualPosition?: string; // 虛擬職位
  adminSetPosition?: string; // 管理員設定職位
  interests: string[];
  skills: string[];
  bio: string;
  department: string;
  startDate: string;
  hireDate?: string; // 入職日期
  progress?: number;
  completedCategories?: number;
  totalCategories?: number;
  rpgClass?: string;
  isFirstLogin?: boolean;
  permissions?: {
    canView: string[];
    canEdit: string[];
    canManage: string[];
  };
  editCount?: number;
  maxEdits?: number;
}

interface CharacterSetupProps {
  onComplete: (profile: UserProfile) => void;
}

const defaultAvatars = [
  '👨🏻‍💼', '👩🏻‍💼', '👨🏻‍🍳', '👩🏻‍🍳', '👨🏻‍💻', '👩🏻‍💻',
  '🧑🏻‍🏫', '👨🏻‍🎓', '👩🏻‍🎓', '🧑🏻‍🍳', '👨🏻‍🔧', '👩🏻‍🔧'
];

const interestOptions = [
  '音樂', '運動', '閱讀', '旅行', '攝影', '烹飪', '電影', '遊戲',
  '藝術', '舞蹈', '健身', '咖啡', '甜點', '語言學習'
];

const skillOptions = [
  '多語言', '領導能力', '創意思維', '問題解決', '時間管理', '溝通協調',
  '電腦技能', '銷售技巧', '客戶服務', '團隊合作', '創新思維', '學習能力'
];

export function CharacterSetup({ onComplete }: CharacterSetupProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    avatar: defaultAvatars[0],
    position: 'front',
    interests: [],
    skills: [],
    bio: '',
    department: '',
    startDate: new Date().toISOString().split('T')[0]
  });

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
      id: `user-${Date.now()}`,
      name: profile.name || '新員工',
      avatar: profile.avatar || defaultAvatars[0],
      position: profile.position || 'front',
      interests: profile.interests || [],
      skills: profile.skills || [],
      bio: profile.bio || '',
      department: profile.department || '',
      startDate: profile.startDate || new Date().toISOString().split('T')[0]
    };
    onComplete(completeProfile);
  };

  const toggleInterest = (interest: string) => {
    const current = profile.interests || [];
    if (current.includes(interest)) {
      setProfile({
        ...profile,
        interests: current.filter(i => i !== interest)
      });
    } else if (current.length < 5) {
      setProfile({
        ...profile,
        interests: [...current, interest]
      });
    }
  };

  const toggleSkill = (skill: string) => {
    const current = profile.skills || [];
    if (current.includes(skill)) {
      setProfile({
        ...profile,
        skills: current.filter(s => s !== skill)
      });
    } else if (current.length < 5) {
      setProfile({
        ...profile,
        skills: [...current, skill]
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <User className="text-blue-500" size={24} />
            <span>建立您的角色檔案</span>
          </CardTitle>
          <p className="text-gray-600">像RPG遊戲一樣設定您的角色資訊</p>
          
          {/* Progress indicator */}
          <div className="flex justify-center space-x-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s === step
                    ? 'bg-blue-500 text-white'
                    : s < step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">基本資訊</h3>
              </div>

              {/* Avatar selection */}
              <div className="space-y-3">
                <Label>選擇頭像</Label>
                <div className="grid grid-cols-6 gap-3">
                  {defaultAvatars.map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => setProfile({ ...profile, avatar })}
                      className={`w-12 h-12 rounded-full text-2xl border-2 transition-all ${
                        profile.avatar === avatar
                          ? 'border-blue-500 bg-blue-50 scale-110'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name input */}
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="請輸入您的姓名"
                />
              </div>

              {/* Position selection */}
              <div className="space-y-3">
                <Label>職位類型</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'front', label: '外場服務', icon: '🍽️' },
                    { value: 'back', label: '內場廚務', icon: '👨‍🍳' },
                    { value: 'management', label: '管理職', icon: '👔' }
                  ].map((pos) => (
                    <button
                      key={pos.value}
                      onClick={() => setProfile({ ...profile, position: pos.value as any })}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        profile.position === pos.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{pos.icon}</div>
                      <div className="font-medium">{pos.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department">部門</Label>
                <Select
                  value={profile.department}
                  onValueChange={(value) => setProfile({ ...profile, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇部門" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="信義">信義</SelectItem>
                    <SelectItem value="內湖">內湖</SelectItem>
                    <SelectItem value="總部">總部</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">興趣與技能</h3>
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <Label className="flex items-center space-x-2">
                  <Heart size={16} className="text-red-500" />
                  <span>興趣愛好 (最多選擇5個)</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <Badge
                      key={interest}
                      variant={profile.interests?.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  已選擇 {profile.interests?.length || 0}/5
                </p>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <Label className="flex items-center space-x-2">
                  <Star size={16} className="text-yellow-500" />
                  <span>特殊技能 (最多選擇5個)</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((skill) => (
                    <Badge
                      key={skill}
                      variant={profile.skills?.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  已選擇 {profile.skills?.length || 0}/5
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">個人簡介</h3>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">自我介紹</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="簡單介紹一下自己，讓同事更了解您..."
                  rows={4}
                />
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-3">預覽</h4>
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{profile.avatar}</div>
                  <div className="flex-1">
                    <h5 className="font-medium">{profile.name || '新員工'}</h5>
                    <p className="text-sm text-gray-600 mb-2">
                      {profile.position === 'front' ? '外場服務' : 
                       profile.position === 'back' ? '內場廚務' : '管理職'} 
                      {profile.department && ` • ${profile.department}`}
                    </p>
                    {profile.interests && profile.interests.length > 0 && (
                      <div className="mb-2">
                        <span className="text-xs text-gray-500">興趣：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.interests.map((interest) => (
                            <Badge key={interest} variant="outline" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.skills && profile.skills.length > 0 && (
                      <div>
                        <span className="text-xs text-gray-500">技能：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
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
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              上一步
            </Button>
            
            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={step === 1 && !profile.name}
              >
                下一步
              </Button>
            ) : (
              <Button onClick={handleComplete}>
                開始培訓
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}