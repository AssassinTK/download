import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UserProfile } from './CharacterSetup';
import { PeopleDirectory } from './PeopleDirectory';
import { VersionHistory } from './VersionHistory';
import { toast } from 'sonner@2.0.3';
import { 
  Map, 
  Trophy, 
  User, 
  Settings, 
  LogOut,
  Sword,
  Shield,
  Star,
  Zap,
  Crown,
  Gem,
  ArrowLeft,
  ChefHat,
  Users as UsersIcon,
  Edit3,
  Save,
  X,
  Castle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface MobileInterfaceProps {
  currentUser: UserProfile;
  isAdmin: boolean;
  onNavigate: (section: string) => void;
  onLogout: () => void;
  onProfileUpdate?: (profile: UserProfile) => void;
}

export function MobileInterface({ currentUser, isAdmin, onNavigate, onLogout, onProfileUpdate }: MobileInterfaceProps) {
  const [activeTab, setActiveTab] = useState('map');
  const [showTrainingOptions, setShowTrainingOptions] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPeopleDirectory, setShowPeopleDirectory] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [editedInterests, setEditedInterests] = useState('');
  
  // Guild Castle content states
  const [castleContents, setCastleContents] = useState([]);
  const [isLoadingCastle, setIsLoadingCastle] = useState(false);

  const loadGuildContent = async () => {
    if (isLoadingCastle) return;
    
    setIsLoadingCastle(true);
    try {
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/guild-castle/content`, {
        headers: {
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCastleContents(data.contents || []);
      }
    } catch (error) {
      console.error('Failed to load guild castle content:', error);
      toast.error('載入城堡內容失敗');
    } finally {
      setIsLoadingCastle(false);
    }
  };

  // RPG風格頭像選項
  const rpgAvatars = [
    '⚔️', '🛡️', '🏹', '⚡', '🔮', '💎',
    '⭐', '💠', '🗡️', '👑', '🧙‍♂️', '👸'
  ];

  const progress = currentUser.progress || 0;
  const level = Math.floor(progress / 20) + 1;
  const experienceToNext = ((level * 20) - progress);

  const tabs = [
    { id: 'map', label: '地圖', icon: <Map size={20} /> },
    ...(!isAdmin ? [{ id: 'quests', label: '任務', icon: <Trophy size={20} /> }] : []),
    { id: 'profile', label: '檔案', icon: <User size={20} /> },
    { id: 'castle', label: '公會城堡', icon: <Castle size={20} /> }
  ];

  const renderMapView = () => {
    if (showPeopleDirectory) {
      return (
        <div className="h-[calc(100vh-140px)]">
          <PeopleDirectory 
            currentUser={currentUser} 
            isAdmin={isAdmin}
            onBack={() => setShowPeopleDirectory(false)}
            onProfileUpdate={onProfileUpdate}
          />
        </div>
      );
    }

    if (showTrainingOptions) {
      return (
        <div className="space-y-4">
          {/* Back button */}
          <div className="flex items-center space-x-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTrainingOptions(false)}
              className="bg-black/30 border-gray-600 text-white hover:bg-gray-800"
            >
              <ArrowLeft size={16} className="mr-1" />
              返回地圖
            </Button>
            <h2 className="text-lg font-bold text-white">選擇修練道</h2>
          </div>

          {/* Training Path Options */}
          <div className="grid grid-cols-1 gap-4">
            {[
              { 
                id: 'outdoor-training', 
                name: '外場修練道', 
                icon: <UsersIcon size={32} />, 
                color: 'from-orange-600 to-red-600',
                description: '外場服務技能培訓'
              },
              { 
                id: 'indoor-training', 
                name: '內場修練道', 
                icon: <ChefHat size={32} />, 
                color: 'from-red-600 to-red-700',
                description: '內場廚藝技能培訓'
              }
            ].map((area) => (
              <Card 
                key={area.id}
                className="bg-black/40 border-white/20 cursor-pointer transform transition-all duration-300 active:scale-95"
                onClick={() => onNavigate(area.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${area.color} flex items-center justify-center shadow-2xl`}>
                      <div className="text-white">{area.icon}</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-xl mb-2">{area.name}</h4>
                      <p className="text-gray-300 text-sm">{area.description}</p>
                      <Badge className="mt-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                        點擊進入
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Player Status Card */}
        <Card className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 border-purple-500/50 text-white">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{currentUser.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-bold text-lg">{currentUser.name}</h3>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                    Lv.{level}
                  </Badge>
                </div>
                <p className="text-sm text-purple-200 mb-2">{currentUser.position}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>經驗值</span>
                    <span>{progress}/100</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-gray-300">距離下級還需 {experienceToNext} 點經驗</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Options Grid */}
        <Card className="bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 border-gray-700/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* 新手村 */}
              <div 
                className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl p-4 text-center cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => onNavigate('newbie-training')}
              >
                <div className="text-3xl mb-2">🏠</div>
                <h3 className="text-white font-bold text-sm">新手村</h3>
                <p className="text-orange-100 text-xs mt-1">新人培訓</p>
              </div>

              {/* 人物廣場 */}
              <div 
                className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl p-4 text-center cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => setShowPeopleDirectory(true)}
              >
                <div className="text-3xl mb-2">👥</div>
                <h3 className="text-white font-bold text-sm">人物廣場</h3>
                <p className="text-blue-100 text-xs mt-1">團隊成員</p>
              </div>

              {/* 外場修練 */}
              <div 
                className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-4 text-center cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => onNavigate('outdoor-training')}
              >
                <div className="text-3xl mb-2">🍽️</div>
                <h3 className="text-white font-bold text-sm">外場修練</h3>
                <p className="text-red-100 text-xs mt-1">服務技能</p>
              </div>

              {/* 內場修練 */}
              <div 
                className="bg-gradient-to-br from-red-600 to-purple-600 rounded-xl p-4 text-center cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => onNavigate('indoor-training')}
              >
                <div className="text-3xl mb-2">👨‍🍳</div>
                <h3 className="text-white font-bold text-sm">內場修練</h3>
                <p className="text-purple-100 text-xs mt-1">廚藝技能</p>
              </div>

              {/* 任務中心 */}
              <div 
                className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-4 text-center cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => onNavigate('task-center')}
              >
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="text-white font-bold text-sm">任務中心</h3>
                <p className="text-indigo-100 text-xs mt-1">培訓進度</p>
              </div>

              {/* 公會城堡 */}
              <div 
                className="bg-gradient-to-br from-amber-600 to-yellow-600 rounded-xl p-4 text-center cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => setActiveTab('castle')}
              >
                <div className="text-3xl mb-2">🏰</div>
                <h3 className="text-white font-bold text-sm">公會城堡</h3>
                <p className="text-yellow-100 text-xs mt-1">公司制度</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderQuestsView = () => {
    // Different quests based on position
    const getQuestsByPosition = () => {
      const baseQuests = [
        { name: '新人培訓', progress: currentUser.progress || 0, reward: '+20 EXP' }
      ];

      if (['外場', '外場PT'].includes(currentUser.position || '')) {
        return [
          ...baseQuests,
          { name: '跑菜技能', progress: 0, reward: '+25 EXP' },
          { name: '顧區服務', progress: 0, reward: '+30 EXP' },
          { name: '吧檯操作', progress: 0, reward: '+25 EXP' },
          { name: 'Duty管理', progress: 0, reward: '+35 EXP' }
        ];
      } else if (['內場', '內場PT'].includes(currentUser.position || '')) {
        return [
          ...baseQuests,
          { name: '炸台操作', progress: 0, reward: '+25 EXP' },
          { name: '沙拉製作', progress: 0, reward: '+20 EXP' },
          { name: '爐台技能', progress: 0, reward: '+30 EXP' },
          { name: 'PIZZA製作', progress: 0, reward: '+30 EXP' },
          { name: 'Duty管理', progress: 0, reward: '+35 EXP' }
        ];
      } else if (currentUser.position === '管理職') {
        return [
          ...baseQuests,
          { name: '團隊管理', progress: 0, reward: '+40 EXP' },
          { name: '培訓指導', progress: 0, reward: '+35 EXP' },
          { name: '品質控制', progress: 0, reward: '+30 EXP' }
        ];
      } else if (isAdmin && currentUser.name === '系統管理員') {
        return [
          { name: '系統管理', progress: 100, reward: '完成' },
          { name: '用戶管理', progress: 100, reward: '完成' },
          { name: '資料監控', progress: 100, reward: '完成' }
        ];
      }
      
      return baseQuests;
    };

    const quests = getQuestsByPosition();

    return (
      <div className="space-y-4">
        <Card className="bg-gradient-to-r from-amber-900/90 to-orange-900/90 border-amber-500/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Trophy className="text-yellow-400" size={20} />
              <span>培訓任務</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quests.map((quest, index) => (
              <div key={index} className="bg-black/30 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-white text-sm font-medium">{quest.name}</span>
                  <Badge className="bg-yellow-500/20 text-yellow-300 text-xs">{quest.reward}</Badge>
                </div>
                <Progress value={quest.progress} className="h-2" />
                <p className="text-xs text-gray-300 mt-1">{quest.progress}% 完成</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Training reminder for non-admin users */}
        {!isAdmin || currentUser.name !== '系統管理員' ? (
          <Card className="bg-gradient-to-r from-blue-900/90 to-purple-900/90 border-blue-500/50">
            <CardContent className="p-4">
              <div className="text-center">
                <Sword className="text-blue-400 mx-auto mb-2" size={24} />
                <h4 className="text-white font-bold mb-1">開始培訓</h4>
                <p className="text-gray-300 text-sm mb-3">前往修練場開始你的技能培訓</p>
                <Button 
                  className="w-full bg-blue-600/20 text-blue-300 border-blue-500/50 hover:bg-blue-600/30"
                  onClick={() => setShowTrainingOptions(true)}
                >
                  進入修練場
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-r from-green-900/90 to-teal-900/90 border-green-500/50">
            <CardContent className="p-4">
              <div className="text-center">
                <Crown className="text-green-400 mx-auto mb-2" size={24} />
                <h4 className="text-white font-bold mb-1">系統管理員</h4>
                <p className="text-gray-300 text-sm">您已完成所有培訓，可管理整個系統</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const handleSaveProfile = async () => {
    try {
      const updatedProfile = {
        ...currentUser,
        ...editedProfile
      };

      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/users/${currentUser.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          profile: updatedProfile
        })
      });

      if (response.ok) {
        // Update currentUser with new data
        const updatedUser = { ...currentUser, ...editedProfile };
        Object.assign(currentUser, editedProfile);
        if (onProfileUpdate) {
          onProfileUpdate(updatedUser);
        }
        setIsEditingProfile(false);
        setEditedProfile({});
        toast.success('個人檔案已更新！');
      } else {
        toast.error('更新個人檔案失敗，請稍後再試');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('更新個人檔案失敗，請稍後再試');
    }
  };

  const handleSaveAvatar = async (avatar: string) => {
    try {
      const updatedProfile = {
        ...currentUser,
        avatar
      };

      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/users/${currentUser.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          profile: updatedProfile
        })
      });

      if (response.ok) {
        Object.assign(currentUser, { avatar });
        if (onProfileUpdate) {
          onProfileUpdate({ ...currentUser, avatar });
        }
        setShowAvatarSelection(false);
        toast.success('頭像已更新！');
      } else {
        toast.error('更新頭像失敗，請稍後再試');
      }
    } catch (error) {
      console.error('Failed to update avatar:', error);
      toast.error('更新頭像失敗，請稍後再試');
    }
  };

  const handleSaveBio = async () => {
    try {
      const updatedProfile = {
        ...currentUser,
        bio: editedBio
      };

      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/users/${currentUser.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          profile: updatedProfile
        })
      });

      if (response.ok) {
        Object.assign(currentUser, { bio: editedBio });
        if (onProfileUpdate) {
          onProfileUpdate({ ...currentUser, bio: editedBio });
        }
        setIsEditingBio(false);
        toast.success('個人簡介已更新！');
      } else {
        toast.error('更新個人簡介失敗，請稍後再試');
      }
    } catch (error) {
      console.error('Failed to update bio:', error);
      toast.error('更新個人簡介失敗，請稍後再試');
    }
  };

  const handleSaveInterests = async () => {
    try {
      const interests = editedInterests.split(',').map(interest => interest.trim()).filter(interest => interest);
      const updatedProfile = {
        ...currentUser,
        interests
      };

      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/users/${currentUser.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          profile: updatedProfile
        })
      });

      if (response.ok) {
        Object.assign(currentUser, { interests });
        if (onProfileUpdate) {
          onProfileUpdate({ ...currentUser, interests });
        }
        setIsEditingInterests(false);
        toast.success('興趣已更新！');
      } else {
        toast.error('更新興趣失敗，請稍後再試');
      }
    } catch (error) {
      console.error('Failed to update interests:', error);
      toast.error('更新興趣失敗，請稍後再試');
    }
  };

  const renderProfileView = () => {
    if (showAvatarSelection) {
      return (
        <div className="space-y-4">
          {/* Back button */}
          <div className="flex items-center space-x-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAvatarSelection(false)}
              className="bg-black/30 border-gray-600 text-white hover:bg-gray-800"
            >
              <ArrowLeft size={16} className="mr-1" />
              返回檔案
            </Button>
            <h2 className="text-lg font-bold text-white">選擇頭像</h2>
          </div>

          {/* RPG Avatar Selection */}
          <Card className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 border-purple-500/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-4 gap-6 mb-6">
                {rpgAvatars.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => handleSaveAvatar(avatar)}
                    className={`w-20 h-20 rounded-xl text-3xl border-3 transition-all transform hover:scale-110 ${
                      currentUser.avatar === avatar
                        ? 'border-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/50'
                        : 'border-gray-600/50 bg-black/30 hover:border-purple-400/50'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
              <p className="text-center text-purple-200 text-sm">點選頭像以選擇你的角色形象</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Card className="bg-gradient-to-br from-slate-900/90 to-gray-900/90 border-gray-500/50">
          <CardHeader>
            <CardTitle className="text-white">個人檔案</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              {/* Avatar */}
              <div className="relative">
                <div 
                  className="text-6xl cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setShowAvatarSelection(true)}
                >
                  {currentUser.avatar}
                </div>

              </div>
              
              {/* Name */}
              <div>
                <h3 className="text-2xl font-bold text-white">{currentUser.name}</h3>
                <p className="text-gray-400">{currentUser.position}</p>
                <p className="text-gray-400 text-sm">{currentUser.department}</p>
              </div>
              
              {/* Skills */}
              <div className="bg-black/30 rounded-lg p-4">
                <h4 className="text-white font-bold mb-2">技能</h4>
                <div className="flex flex-wrap gap-2">
                  {(currentUser.skills || []).length > 0 ? (
                    (currentUser.skills || []).map((skill) => (
                      <Badge key={skill} className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">尚未設定技能</p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="bg-black/30 rounded-lg p-4 text-left">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-white font-bold">個人簡介</h4>
                  {!isEditingBio ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsEditingBio(true);
                        setEditedBio(currentUser.bio || '');
                      }}
                      className="bg-purple-600/20 border-purple-500/50 text-purple-300 hover:bg-purple-600/30"
                    >
                      <Edit3 size={12} className="mr-1" />
                      編輯
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleSaveBio}
                        className="bg-green-600/20 border-green-500/50 text-green-300 hover:bg-green-600/30"
                      >
                        <Save size={12} className="mr-1" />
                        儲存
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditingBio(false);
                          setEditedBio('');
                        }}
                        className="bg-red-600/20 border-red-500/50 text-red-300 hover:bg-red-600/30"
                      >
                        <X size={12} className="mr-1" />
                        取消
                      </Button>
                    </div>
                  )}
                </div>
                {isEditingBio ? (
                  <Textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="bg-black/30 border-gray-600 text-white min-h-[100px]"
                    placeholder="輸入個人簡介..."
                  />
                ) : (
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {currentUser.bio || '尚未設定個人簡介'}
                  </p>
                )}
              </div>

              {/* Interests */}
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-white font-bold">興趣</h4>
                  {!isEditingInterests ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsEditingInterests(true);
                        setEditedInterests((currentUser.interests || []).join(', '));
                      }}
                      className="bg-blue-600/20 border-blue-500/50 text-blue-300 hover:bg-blue-600/30"
                    >
                      <Edit3 size={12} className="mr-1" />
                      編輯
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleSaveInterests}
                        className="bg-green-600/20 border-green-500/50 text-green-300 hover:bg-green-600/30"
                      >
                        <Save size={12} className="mr-1" />
                        儲存
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditingInterests(false);
                          setEditedInterests('');
                        }}
                        className="bg-red-600/20 border-red-500/50 text-red-300 hover:bg-red-600/30"
                      >
                        <X size={12} className="mr-1" />
                        取消
                      </Button>
                    </div>
                  )}
                </div>
                {isEditingInterests ? (
                  <Input
                    value={editedInterests}
                    onChange={(e) => setEditedInterests(e.target.value)}
                    className="bg-black/30 border-gray-600 text-white"
                    placeholder="興趣列表 (用逗號分隔)"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(currentUser.interests || []).length > 0 ? (
                      (currentUser.interests || []).map((interest) => (
                        <Badge key={interest} className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                          {interest}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">尚未設定興趣</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Version Information */}
        <Card className="bg-gradient-to-br from-gray-900/90 to-slate-900/90 border-gray-500/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">系統版本</p>
              <VersionHistory 
                currentVersion="1.04"
                className="text-yellow-400 bg-black/20 border-yellow-400/20 hover:border-yellow-400/40"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Load content when first accessing castle tab
  useEffect(() => {
    if (activeTab === 'castle' && castleContents.length === 0) {
      loadGuildContent();
    }
  }, [activeTab, castleContents.length]);

  const renderCastleView = () => {
    const CONTENT_TYPES = [
      { id: 'company_rules', name: '公司制度', icon: '📋', color: 'from-blue-900/90 to-indigo-900/90' },
      { id: 'bonus_system', name: '獎金制度', icon: '💰', color: 'from-green-900/90 to-emerald-900/90' },
      { id: 'benefits', name: '福利制度', icon: '🎁', color: 'from-purple-900/90 to-pink-900/90' },
      { id: 'announcements', name: '公告事項', icon: '📢', color: 'from-orange-900/90 to-red-900/90' }
    ];

    const getContentsByType = (type) => {
      return castleContents.filter(content => content.type === type);
    };

    return (
      <div className="space-y-4">
        {/* Castle Header */}
        <Card className="bg-gradient-to-r from-amber-900/90 to-yellow-900/90 border-yellow-500/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Castle className="text-yellow-400" size={20} />
              <span>公會城堡</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-yellow-200 text-sm">
              {isAdmin ? '管理員可編輯公會制度與福利內容' : 'Guild Order 總部規章制度'}
            </p>
          </CardContent>
        </Card>

        {isLoadingCastle ? (
          <Card className="bg-black/30 border-gray-600">
            <CardContent className="p-8 text-center">
              <div className="text-white">載入城堡內容中...</div>
            </CardContent>
          </Card>
        ) : (
          CONTENT_TYPES.map((type) => {
            const contents = getContentsByType(type.id);
            
            return (
              <Card key={type.id} className={`bg-gradient-to-br ${type.color} border-opacity-50`}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <div className="text-2xl">{type.icon}</div>
                    <span>{type.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contents.length === 0 ? (
                    <div className="bg-black/30 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm">尚無{type.name}內容</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {contents.map((content) => (
                        <div key={content.id} className="bg-black/30 rounded-lg p-4">
                          <h4 className="text-white font-medium mb-2">{content.title}</h4>
                          <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                            {content.content}
                          </div>
                          <div className="mt-3 text-xs text-gray-400">
                            更新者: {content.updatedBy} • {new Date(content.lastUpdated).toLocaleDateString('zh-TW')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}

        {/* Admin Panel Access (for admins only) */}
        {isAdmin && (
          <Card className="bg-gradient-to-r from-red-900/90 to-rose-900/90 border-red-500/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Settings className="text-red-400" size={20} />
                <span>系統管理</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-black/30 text-white border-gray-600 hover:bg-gray-800"
                onClick={() => onNavigate('admin-panel')}
              >
                用戶管理
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Version Information */}
        <Card className="bg-gradient-to-r from-gray-900/90 to-slate-900/90 border-gray-600/50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">系統版本</p>
              <VersionHistory 
                currentVersion="1.04"
                className="text-yellow-400 bg-black/20 border-yellow-400/20 hover:border-yellow-400/40"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Epic background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-blue-400 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">{currentUser.avatar}</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Guild Order
              </h1>
              <p className="text-sm text-gray-300">{currentUser.name} • Lv.{level}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="bg-black/30 border-gray-600 text-red-400 hover:bg-red-900/20"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 pb-24">
        {activeTab === 'map' && renderMapView()}
        {activeTab === 'quests' && renderQuestsView()}
        {activeTab === 'profile' && renderProfileView()}
        {activeTab === 'castle' && renderCastleView()}
      </div>

      {/* Bottom Navigation */}
      {!showTrainingOptions && !showPeopleDirectory && !showAvatarSelection && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-700/50 p-4 z-20">
          <div className="flex justify-around items-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}