import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Eye, 
  Settings,
  Shield,
  BarChart3,
  UserPlus,
  ArrowLeft,
  Target,
  BookOpen,
  Bug
} from 'lucide-react';
import { PermissionManager } from './PermissionManager';
import { TaskManager } from './TaskManager';
import { ContentEditor } from './ContentEditor';
import { DebugPanel } from './DebugPanel';
import { UserProfile } from './CharacterSetup';
import { VersionHistory } from './VersionHistory';
import { toast } from 'sonner@2.0.3';

interface AdminPanelProps {
  currentAdmin: UserProfile;
  onBack: () => void;
}

interface UserData {
  id: string;
  password: string;
  profile: UserProfile;
  progress: {
    completedCategories: number;
    totalCategories: number;
    percentage: number;
  };
  lastActive: string;
  permissions: {
    canViewOthers: boolean;
    canEditProfile: boolean;
  };
}

export function AdminPanel({ currentAdmin, onBack }: AdminPanelProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'permissions' | 'tasks' | 'content' | 'debug'>('main');
  const [newUserData, setNewUserData] = useState({
    password: '',
    name: '',
    position: '外場' as '外場' | '外場PT' | '內場' | '內場PT' | '管理職',
    department: '信義' as '信義' | '內湖' | '總部',
    canViewOthers: false,
    canEditProfile: true
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/admin/users`, {
        headers: {
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('載入用戶列表失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const addUser = async () => {
    if (!newUserData.password || !newUserData.name) {
      toast.error('請填寫完整資料');
      return;
    }

    try {
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          password: newUserData.password,
          name: newUserData.name,
          position: newUserData.position,
          department: newUserData.department
        })
      });

      if (response.ok) {
        toast.success('用戶建立成功');
        setShowAddUser(false);
        setNewUserData({
          password: '',
          name: '',
          position: '外場',
          department: '信義',
          canViewOthers: false,
          canEditProfile: true
        });
        loadUsers();
      } else {
        const error = await response.json();
        toast.error(error.error || '建立用戶失敗');
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      toast.error('建立用戶過程發生錯誤');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('確定要刪除此用戶嗎？此操作無法復原。')) {
      return;
    }

    try {
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        }
      });

      if (response.ok) {
        toast.success('用戶刪除成功');
        loadUsers();
      } else {
        toast.error('刪除用戶失敗');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('刪除用戶過程發生錯誤');
    }
  };

  const exportData = async () => {
    try {
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/admin/export`, {
        headers: {
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `guild_order_data_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('資料匯出成功');
      } else {
        toast.error('資料匯出失敗');
      }
    } catch (error) {
      console.error('Failed to export data:', error);
      toast.error('匯出過程發生錯誤');
    }
  };

  const getPositionText = (position: string) => {
    const positions: { [key: string]: string } = {
      '外場': '外場服務',
      '外場PT': '外場PT',
      '內場': '內場廚務',
      '內場PT': '內場PT',
      '管理職': '管理職',
      '系統管理員': '系統管理員'
    };
    return positions[position] || position;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-100 text-green-800';
    if (percentage >= 75) return 'bg-blue-100 text-blue-800';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800';
    if (percentage >= 25) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  // Render different views based on currentView
  if (currentView === 'permissions') {
    return (
      <PermissionManager 
        currentAdmin={currentAdmin}
        onBack={() => setCurrentView('main')}
      />
    );
  }

  if (currentView === 'tasks') {
    return (
      <TaskManager 
        currentUser={currentAdmin}
        onBack={() => setCurrentView('main')}
      />
    );
  }

  if (currentView === 'content') {
    return (
      <ContentEditor 
        currentAdmin={currentAdmin}
        onBack={() => setCurrentView('main')}
      />
    );
  }

  if (currentView === 'debug') {
    return (
      <DebugPanel 
        currentAdmin={currentAdmin}
        onBack={() => setCurrentView('main')}
      />
    );
  }

  // Main view
  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 p-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Shield className="text-blue-500" size={20} />
          <div>
            <h1 className="text-xl font-semibold text-gray-800">系統管理中心</h1>
            <p className="text-sm text-gray-600">用戶管理、權限設定與系統監控</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">總用戶數</p>
                  <p className="text-2xl font-bold text-blue-600">{users.length}</p>
                </div>
                <Users className="text-blue-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">活躍用戶</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter(u => {
                      const lastActive = new Date(u.lastActive);
                      const daysSinceActive = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
                      return daysSinceActive <= 7;
                    }).length}
                  </p>
                </div>
                <Eye className="text-green-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">平均進度</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {users.length > 0 
                      ? Math.round(users.reduce((acc, u) => acc + u.progress.percentage, 0) / users.length)
                      : 0}%
                  </p>
                </div>
                <BarChart3 className="text-orange-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">完成培訓</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {users.filter(u => u.progress.percentage === 100).length}
                  </p>
                </div>
                <Settings className="text-purple-500" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings size={20} />
              <span>管理功能</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Button
                onClick={() => setCurrentView('permissions')}
                className="flex items-center space-x-2 h-auto p-4 flex-col"
                variant="outline"
              >
                <Shield size={24} />
                <span>權限管理</span>
              </Button>
              <Button
                onClick={() => {
                  console.log('Switching to tasks view');
                  setCurrentView('tasks');
                }}
                className="flex items-center space-x-2 h-auto p-4 flex-col"
                variant="outline"
              >
                <Target size={24} />
                <span>任務管理</span>
              </Button>
              <Button
                onClick={() => setCurrentView('content')}
                className="flex items-center space-x-2 h-auto p-4 flex-col"
                variant="outline"
              >
                <BookOpen size={24} />
                <span>內容編輯</span>
              </Button>
              <Button
                onClick={() => setCurrentView('debug')}
                className="flex items-center space-x-2 h-auto p-4 flex-col"
                variant="outline"
              >
                <Bug size={24} />
                <span>系統除錯</span>
              </Button>
              <Button
                onClick={exportData}
                className="flex items-center space-x-2 h-auto p-4 flex-col"
                variant="outline"
              >
                <Download size={24} />
                <span>資料匯出</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users size={20} />
                <span>用戶管理</span>
              </CardTitle>
              <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center space-x-1">
                    <Plus size={14} />
                    <span>新增用戶</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>新增用戶</DialogTitle>
                    <DialogDescription>
                      建立新的用戶帳號並設定基本資料
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="password">4位數密碼</Label>
                      <Input
                        id="password"
                        type="text"
                        value={newUserData.password}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setNewUserData({ ...newUserData, password: value });
                        }}
                        placeholder="輸入4位數字"
                        maxLength={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">姓名</Label>
                      <Input
                        id="name"
                        value={newUserData.name}
                        onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                        placeholder="輸入用戶姓名"
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">職位</Label>
                      <select
                        id="position"
                        value={newUserData.position}
                        onChange={(e) => setNewUserData({ ...newUserData, position: e.target.value as any })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="外場">外場</option>
                        <option value="外場PT">外場PT</option>
                        <option value="內場">內場</option>
                        <option value="內場PT">內場PT</option>
                        <option value="管理職">管理職</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="department">部門</Label>
                      <select
                        id="department"
                        value={newUserData.department}
                        onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value as '信義' | '內湖' | '總部' })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="信義">信義</option>
                        <option value="內湖">內湖</option>
                        <option value="總部">總部</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowAddUser(false)}>
                        取消
                      </Button>
                      <Button onClick={addUser}>
                        建立用戶
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="text-2xl">{user.profile.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{user.profile.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {user.password}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {getPositionText(user.profile.position)} • {user.profile.department}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={`text-xs ${getProgressColor(user.progress.percentage)}`}>
                            進度: {user.progress.percentage}%
                          </Badge>
                          {user.permissions.canViewOthers && (
                            <Badge variant="outline" className="text-xs">可查看他人</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <UserPlus size={48} className="mx-auto mb-2 opacity-50" />
                    <p>尚未有任何用戶</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* Version Information */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">系統版本</p>
              <VersionHistory 
                currentVersion="1.04"
                className="text-blue-600 bg-blue-50 border-blue-200 hover:border-blue-400"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}