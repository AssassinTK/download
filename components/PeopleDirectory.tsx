import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { ProfileEditDialog } from './ProfileEditDialog';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Calendar, 
  Heart, 
  Star, 
  Trophy,
  Clock,
  CheckCircle,
  Circle,
  Wifi,
  WifiOff,
  Edit
} from 'lucide-react';

interface PeopleDirectoryProps {
  currentUser: any;
  onBack: () => void;
  isAdmin: boolean;
  onProfileUpdate?: (profile: any) => void;
}

interface TeamMember {
  profile: any;
  lastActive: string;
}

export function PeopleDirectory({ currentUser, onBack, isAdmin, onProfileUpdate }: PeopleDirectoryProps) {
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | '外場' | '外場PT' | '內場' | '內場PT' | '管理職'>('all');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // 獲取在線狀態
  const getOnlineStatus = (lastActive: string) => {
    const lastActiveTime = new Date(lastActive);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastActiveTime.getTime()) / (1000 * 60));
    
    if (diffMinutes < 5) {
      return { status: 'online', label: '在線' };
    } else if (diffMinutes < 30) {
      return { status: 'recent', label: `${diffMinutes}分鐘前` };
    } else if (diffMinutes < 60) {
      return { status: 'away', label: '30分鐘前' };
    } else {
      const hours = Math.floor(diffMinutes / 60);
      if (hours < 24) {
        return { status: 'offline', label: `${hours}小時前` };
      } else {
        const days = Math.floor(hours / 24);
        return { status: 'offline', label: `${days}天前` };
      }
    }
  };

  // 獲取查看權限
  const getViewPermissions = (userPosition: string) => {
    switch (userPosition) {
      case 'GOD':
      case '絕對神':
        return ['GOD', '絕對神', '管理職', '外場', '內場', '外場PT', '內場PT'];
      case '管理職':
        return ['管理職', '外場', '內場', '外場PT', '內場PT'];
      case '外場':
      case '內場':
        return ['外場', '內場', '外場PT', '內場PT'];
      case '外場PT':
      case '內場PT':
        return ['外場PT', '內場PT'];
      default:
        return [userPosition];
    }
  };

  // 載入團隊成員數據
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/team/members?requesterId=${currentUser.id}`, {
          headers: {
            'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data.members || []);
        } else {
          console.error('Failed to load team members');
          toast.error('載入團隊成員失敗');
        }
      } catch (error) {
        console.error('Error loading team members:', error);
        toast.error('載入團隊成員時發生錯誤');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.id) {
      loadTeamMembers();
    }
  }, [currentUser]);

  // 處理編輯個人檔案
  const handleStartEdit = () => {
    console.log('handleStartEdit called');
    console.log('selectedPerson:', selectedPerson);
    console.log('currentUser:', currentUser);
    console.log('selectedPerson.id:', selectedPerson?.id);
    console.log('currentUser.id:', currentUser?.id);
    console.log('ID comparison:', String(selectedPerson?.id) === String(currentUser?.id));
    
    if (selectedPerson && currentUser && String(selectedPerson.id) === String(currentUser.id)) {
      console.log('Opening edit dialog...');
      setShowEditDialog(true);
      toast.success('打開編輯對話框');
    } else {
      console.log('Edit not allowed - not own profile');
      toast.error('只能編輯自己的個人檔案');
    }
  };

  // 處理儲存個人檔案
  const handleSaveProfile = (updatedProfile: any) => {
    // 更新本地狀態
    setSelectedPerson(updatedProfile);
    setTeamMembers(prev => 
      prev.map(member => 
        member.profile.id === currentUser.id 
          ? { ...member, profile: updatedProfile }
          : member
      )
    );
    
    // 通知父組件更新
    if (onProfileUpdate) {
      onProfileUpdate(updatedProfile);
    }
  };

  // 處理所有成員數據
  const allMembers = teamMembers.map(member => ({
    ...member.profile,
    lastActive: member.lastActive || new Date().toISOString(),
    onlineStatus: getOnlineStatus(member.lastActive || new Date().toISOString())
  }));

  // 過濾成員
  const filteredMembers = allMembers.filter(member => 
    filter === 'all' || member.position === filter
  );

  // 職位標籤和顏色
  const getPositionLabel = (position: string) => {
    switch (position) {
      case '外場': return '外場';
      case '外場PT': return '外場PT';
      case '內場': return '內場';
      case '內場PT': return '內場PT';
      case '管理職': return '管理職';
      case 'GOD': return 'GOD';
      case '絕對神': return '絕對神';
      default: return position || '未設定';
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case '外場': return 'bg-blue-100 text-blue-800';
      case '外場PT': return 'bg-blue-50 text-blue-600';
      case '內場': return 'bg-red-100 text-red-800';
      case '內場PT': return 'bg-red-50 text-red-600';
      case '管理職': return 'bg-purple-100 text-purple-800';
      case 'GOD':
      case '絕對神': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">載入團隊成員中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 p-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-1 flex-shrink-0"
          >
            <ArrowLeft size={16} />
            <span>返回</span>
          </Button>
          <User className="text-teal-500 flex-shrink-0" size={20} />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold text-gray-800 truncate">團隊成員</h1>
            <p className="text-sm text-gray-600 truncate">認識您的工作夥伴</p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { key: 'all', label: '全部' },
            { key: '管理職', label: '管理職' },
            { key: '外場', label: '外場' },
            { key: '外場PT', label: '外場PT' },
            { key: '內場', label: '內場' },
            { key: '內場PT', label: '內場PT' }
          ].filter(f => {
            if (f.key === 'all') return true;
            const allowedPositions = getViewPermissions(currentUser.position || '');
            return allowedPositions.includes(f.key);
          }).map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.key as any)}
              className="text-xs"
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <Card 
                key={member.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm border-white/50"
                onClick={() => setSelectedPerson(member)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="text-3xl">{member.avatar}</div>
                      {/* Online status indicator */}
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        member.onlineStatus.status === 'online' ? 'bg-green-500' :
                        member.onlineStatus.status === 'recent' ? 'bg-yellow-500' :
                        member.onlineStatus.status === 'away' ? 'bg-orange-500' :
                        'bg-gray-400'
                      }`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold truncate">{member.name}</h3>
                        {member.id === currentUser.id && (
                          <Badge variant="outline" className="text-xs">我</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={`text-xs ${getPositionColor(member.position)}`}>
                          {getPositionLabel(member.position)}
                        </Badge>
                        {member.department && (
                          <span className="text-xs text-gray-500">{member.department}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        {member.onlineStatus.status === 'online' ? (
                          <Wifi size={12} className="mr-1 text-green-500" />
                        ) : (
                          <WifiOff size={12} className="mr-1 text-gray-400" />
                        )}
                        {member.onlineStatus.label}
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>培訓進度</span>
                          <span>{member.progress || 0}%</span>
                        </div>
                        <Progress value={member.progress || 0} className="h-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">沒有找到符合條件的團隊成員</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Member Detail Dialog */}
      {selectedPerson && (
        <Dialog open={!!selectedPerson} onOpenChange={() => setSelectedPerson(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{selectedPerson.avatar}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span>{selectedPerson.name}</span>
                      {selectedPerson && currentUser && String(selectedPerson.id) === String(currentUser.id) && (
                        <Badge variant="outline">我的檔案</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getPositionColor(selectedPerson.position)}>
                        {getPositionLabel(selectedPerson.position)}
                      </Badge>
                      {selectedPerson.department && (
                        <span className="text-sm text-gray-500">{selectedPerson.department}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 編輯按鈕 - 只有本人可以編輯 */}
                {selectedPerson && currentUser && String(selectedPerson.id) === String(currentUser.id) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStartEdit}
                    className="flex items-center space-x-1"
                  >
                    <Edit size={14} />
                    <span>編輯</span>
                  </Button>
                )}
              </DialogTitle>
              <DialogDescription>
                查看 {selectedPerson.name} 的詳細檔案資料，包括學習進度、興趣愛好和技能。
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Progress section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <Trophy className="mr-2 text-yellow-500" size={16} />
                  學習進度
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>整體完成度</span>
                    <span>{selectedPerson.progress || 0}%</span>
                  </div>
                  <Progress value={selectedPerson.progress || 0} className="h-2" />
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span className="flex items-center">
                      <CheckCircle size={12} className="mr-1 text-green-500" />
                      已完成：{selectedPerson.completedCategories || 0}
                    </span>
                    <span className="flex items-center">
                      <Circle size={12} className="mr-1 text-gray-400" />
                      總計：{selectedPerson.totalCategories || 7}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio section */}
              {selectedPerson.bio && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <User className="mr-2 text-blue-500" size={16} />
                    個人簡介
                  </h4>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm leading-relaxed">
                    {selectedPerson.bio}
                  </p>
                </div>
              )}

              {/* Interests section */}
              {selectedPerson.interests && selectedPerson.interests.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Heart className="mr-2 text-pink-500" size={16} />
                    興趣愛好
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPerson.interests.map((interest: string) => (
                      <Badge key={interest} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills section */}
              {selectedPerson.skills && selectedPerson.skills.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Star className="mr-2 text-yellow-500" size={16} />
                    技能
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPerson.skills.map((skill: string) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Join date */}
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={16} className="mr-2" />
                加入時間：{new Date(selectedPerson.startDate).toLocaleDateString('zh-TW')}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Profile Edit Dialog */}
      {showEditDialog && selectedPerson && (
        <ProfileEditDialog
          user={selectedPerson}
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}