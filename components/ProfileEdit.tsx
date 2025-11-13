import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ArrowLeft, Edit, AlertCircle, Save, User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { UserProfile } from './CharacterSetup';

interface ProfileEditProps {
  currentUser: UserProfile;
  onBack: () => void;
  onProfileUpdate: (profile: UserProfile) => void;
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

export function ProfileEdit({ currentUser, onBack, onProfileUpdate }: ProfileEditProps) {
  const [editCount, setEditCount] = useState(0);
  const [maxEdits, setMaxEdits] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(currentUser);

  useEffect(() => {
    loadEditHistory();
  }, []);

  const loadEditHistory = async () => {
    try {
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/users/${currentUser.id}/edit-history`, {
        headers: {
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEditCount(data.editCount || 0);
        setMaxEdits(data.maxEdits || 2);
      }
    } catch (error) {
      console.error('Failed to load edit history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (editCount >= maxEdits) {
      toast.error('已達到修改次數上限');
      return;
    }

    try {
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/users/${currentUser.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          profile: editedProfile
        })
      });

      if (response.ok) {
        toast.success('個人資料更新成功');
        setEditCount(editCount + 1);
        setShowEditDialog(false);
        onProfileUpdate(editedProfile);
      } else {
        const result = await response.json();
        toast.error(result.error || '更新失敗');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('更新過程發生錯誤');
    }
  };

  const toggleInterest = (interest: string) => {
    const current = editedProfile.interests || [];
    if (current.includes(interest)) {
      setEditedProfile({
        ...editedProfile,
        interests: current.filter(i => i !== interest)
      });
    } else if (current.length < 5) {
      setEditedProfile({
        ...editedProfile,
        interests: [...current, interest]
      });
    }
  };

  const toggleSkill = (skill: string) => {
    const current = editedProfile.skills || [];
    if (current.includes(skill)) {
      setEditedProfile({
        ...editedProfile,
        skills: current.filter(s => s !== skill)
      });
    } else if (current.length < 5) {
      setEditedProfile({
        ...editedProfile,
        skills: [...current, skill]
      });
    }
  };

  const getPositionText = (position: string) => {
    switch (position) {
      case 'front': return '外場服務';
      case 'back': return '內場廚務';
      case 'management': return '管理職';
      case '外場': return '外場';
      case '外場PT': return '外場PT';
      case '內場': return '內場';
      case '內場PT': return '內場PT';
      case '管理職': return '管理職';
      case '系統管理員': return '系統管理員';
      default: return position || '未設定';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>載入中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 p-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-1"
          >
            <ArrowLeft size={16} />
            <span>返回村莊地圖</span>
          </Button>
          <User className="text-blue-500" size={20} />
          <div>
            <h1 className="text-xl font-semibold text-gray-800">個人資料</h1>
            <p className="text-sm text-gray-600">查看和編輯您的個人資訊</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Edit Status Card */}
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="text-orange-500" size={20} />
                <span>編輯權限</span>
              </div>
              <Badge variant={editCount >= maxEdits ? "destructive" : "secondary"}>
                {editCount}/{maxEdits} 次
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {editCount >= maxEdits 
                ? '您已用完所有的編輯次數，如需修改請聯繫管理員。'
                : `您還可以修改個人資料 ${maxEdits - editCount} 次。`
              }
            </p>
          </CardContent>
        </Card>

        {/* Current Profile Display */}
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">{currentUser.avatar}</span>
                <div>
                  <span>{currentUser.name}</span>
                  <p className="text-sm text-gray-600 font-normal mt-1">
                    {getPositionText(currentUser.position)} • {currentUser.department}
                  </p>
                  {currentUser.virtualPosition && (
                    <p className="text-xs text-purple-600 font-normal">
                      虛擬職位: {currentUser.virtualPosition}
                    </p>
                  )}
                  {currentUser.adminSetPosition && (
                    <p className="text-xs text-blue-600 font-normal">
                      管理員設定: {currentUser.adminSetPosition}
                    </p>
                  )}
                  {currentUser.hireDate && (
                    <p className="text-xs text-green-600 font-normal">
                      入職日期: {new Date(currentUser.hireDate).toLocaleDateString('zh-TW')}
                    </p>
                  )}
                </div>
              </CardTitle>
              <Button
                onClick={() => {
                  setEditedProfile(currentUser);
                  setShowEditDialog(true);
                }}
                disabled={editCount >= maxEdits}
                className="flex items-center space-x-1"
              >
                <Edit size={14} />
                <span>編輯資料</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bio */}
            <div>
              <Label className="text-sm font-medium text-gray-700">自我介紹</Label>
              <p className="text-gray-600 mt-1">
                {currentUser.bio || '尚未填寫自我介紹'}
              </p>
            </div>

            {/* Interests */}
            {currentUser.interests && currentUser.interests.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-700">興趣愛好</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {currentUser.interests.map((interest) => (
                    <Badge key={interest} variant="outline">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {currentUser.skills && currentUser.skills.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-700">特殊技能</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {currentUser.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>編輯個人資料</DialogTitle>
            <DialogDescription>
              更新您的個人資訊，包括頭像、姓名、自我介紹、興趣愛好和特殊技能。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Avatar selection */}
            <div className="space-y-3">
              <Label>頭像</Label>
              <div className="grid grid-cols-6 gap-3">
                {defaultAvatars.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => setEditedProfile({ ...editedProfile, avatar })}
                    className={`w-12 h-12 rounded-full text-2xl border-2 transition-all ${
                      editedProfile.avatar === avatar
                        ? 'border-blue-500 bg-blue-50 scale-110'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                placeholder="請輸入您的姓名"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">自我介紹</Label>
              <Textarea
                id="bio"
                value={editedProfile.bio}
                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                placeholder="簡單介紹一下自己..."
                rows={3}
              />
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <Label>興趣愛好 (最多5個)</Label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <Badge
                    key={interest}
                    variant={editedProfile.interests?.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                已選擇 {editedProfile.interests?.length || 0}/5
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <Label>特殊技能 (最多5個)</Label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map((skill) => (
                  <Badge
                    key={skill}
                    variant={editedProfile.skills?.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                已選擇 {editedProfile.skills?.length || 0}/5
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
            >
              取消
            </Button>
            <Button
              onClick={handleSaveProfile}
              className="flex items-center space-x-1"
            >
              <Save size={14} />
              <span>儲存修改</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}