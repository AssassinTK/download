import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { Edit, Save, X } from 'lucide-react';
import { UserProfile } from './CharacterSetup';

interface ProfileEditDialogProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: UserProfile) => void;
}

export function ProfileEditDialog({ user, isOpen, onClose, onSave }: ProfileEditDialogProps) {
  const [editFormData, setEditFormData] = useState({
    name: user.name || '',
    avatar: user.avatar || '🧙‍♂️',
    bio: user.bio || '',
    interests: [...(user.interests || [])],
    skills: [...(user.skills || [])],
    newInterest: '',
    newSkill: ''
  });

  // RPG頭像選項
  const avatarOptions = [
    '🧙‍♂️', '🧙‍♀️', '⚔️', '🛡️', 
    '🏹', '🗡️', '⚡', '🔥',
    '❄️', '🌟', '💎', '🌙'
  ];

  const handleSave = async () => {
    console.log('ProfileEditDialog - handleSave called');
    console.log('user:', user);
    console.log('editFormData:', editFormData);
    
    try {
      const updatedProfile = {
        ...user,
        name: editFormData.name,
        avatar: editFormData.avatar,
        bio: editFormData.bio,
        interests: editFormData.interests,
        skills: editFormData.skills
      };
      
      console.log('updatedProfile:', updatedProfile);

      // 調用API更新
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/users/${user.id}/profile`, {
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
        onSave(updatedProfile);
        toast.success('個人檔案已成功更新！');
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || '更新失敗');
      }
    } catch (error) {
      console.error('Save profile error:', error);
      toast.error('更新個人檔案失敗：' + error.message);
    }
  };

  const handleAddInterest = () => {
    if (editFormData.newInterest.trim() && !editFormData.interests.includes(editFormData.newInterest.trim())) {
      setEditFormData(prev => ({
        ...prev,
        interests: [...prev.interests, prev.newInterest.trim()],
        newInterest: ''
      }));
    }
  };

  const handleRemoveInterest = (index: number) => {
    setEditFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const handleAddSkill = () => {
    if (editFormData.newSkill.trim() && !editFormData.skills.includes(editFormData.newSkill.trim())) {
      setEditFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ''
      }));
    }
  };

  const handleRemoveSkill = (index: number) => {
    setEditFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>編輯個人檔案</span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="flex items-center space-x-1"
              >
                <X size={14} />
                <span>取消</span>
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="flex items-center space-x-1"
              >
                <Save size={14} />
                <span>保存</span>
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 姓名編輯 */}
          <div>
            <Label htmlFor="edit-name">姓名</Label>
            <Input
              id="edit-name"
              value={editFormData.name}
              onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1"
            />
          </div>

          {/* 頭像選擇 */}
          <div>
            <Label>頭像</Label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {avatarOptions.map(avatar => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setEditFormData(prev => ({ ...prev, avatar }))}
                  className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                    editFormData.avatar === avatar 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* 個人簡介編輯 */}
          <div>
            <Label htmlFor="edit-bio">個人簡介</Label>
            <Textarea
              id="edit-bio"
              value={editFormData.bio}
              onChange={(e) => setEditFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="請輸入個人簡介..."
              rows={3}
              className="mt-1"
            />
          </div>

          {/* 興趣編輯 */}
          <div>
            <Label>興趣愛好</Label>
            <div className="mt-2 space-y-2">
              <div className="flex flex-wrap gap-2">
                {editFormData.interests.map((interest: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-red-50"
                    onClick={() => handleRemoveInterest(index)}
                  >
                    {interest} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={editFormData.newInterest}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, newInterest: e.target.value }))}
                  placeholder="新增興趣..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                />
                <Button type="button" size="sm" onClick={handleAddInterest}>
                  新增
                </Button>
              </div>
            </div>
          </div>

          {/* 技能編輯 */}
          <div>
            <Label>特殊技能</Label>
            <div className="mt-2 space-y-2">
              <div className="flex flex-wrap gap-2">
                {editFormData.skills.map((skill: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-red-50"
                    onClick={() => handleRemoveSkill(index)}
                  >
                    {skill} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={editFormData.newSkill}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, newSkill: e.target.value }))}
                  placeholder="新增技能..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <Button type="button" size="sm" onClick={handleAddSkill}>
                  新增
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}