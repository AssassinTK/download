import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, Shield, Eye, Edit, Settings, Users, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { UserProfile } from './CharacterSetup';

interface PermissionManagerProps {
  currentAdmin: UserProfile;
  onBack: () => void;
}

interface UserWithPermissions extends UserProfile {
  permissions: {
    canView: string[];
    canEdit: string[];
    canManage: string[];
  };
}

const PERMISSION_AREAS = [
  { id: 'all_profiles', name: '所有用戶檔案', category: 'profiles' },
  { id: 'admin_profiles', name: '管理員檔案', category: 'profiles' },
  { id: 'management_profiles', name: '管理職檔案', category: 'profiles' },
  { id: 'front_profiles', name: '外場檔案', category: 'profiles' },
  { id: 'back_profiles', name: '內場檔案', category: 'profiles' },
  { id: 'training_outdoor', name: '外場培訓', category: 'training' },
  { id: 'training_indoor', name: '內場培訓', category: 'training' },
  { id: 'task_management', name: '任務管理', category: 'tasks' },
  { id: 'user_management', name: '用戶管理', category: 'admin' },
  { id: 'system_settings', name: '系統設定', category: 'admin' },
  { id: 'data_export', name: '資料匯出', category: 'admin' }
];

const POSITION_OPTIONS = [
  '外場', '外場PT', '內場', '內場PT', '管理職', '絕對神'
];

export function PermissionManager({ currentAdmin, onBack }: PermissionManagerProps) {
  const [users, setUsers] = useState<UserWithPermissions[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithPermissions | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newUserData, setNewUserData] = useState({
    name: '',
    position: '',
    virtualPosition: '',
    adminSetPosition: '',
    department: '',
    hireDate: new Date().toISOString().split('T')[0]
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
        setUsers((data.users || []).map((user: any) => ({
          ...user,
          profile: user.profile || {},
          permissions: {
            canView: user.permissions?.canView || [],
            canEdit: user.permissions?.canEdit || [],
            canManage: user.permissions?.canManage || []
          },
          // Ensure all required fields exist
          id: user.id || '',
          name: user.profile?.name || user.name || '',
          position: user.profile?.position || user.position || '',
          department: user.profile?.department || user.department || '',
          avatar: user.profile?.avatar || user.avatar || '👤',
          virtualPosition: user.profile?.virtualPosition || '',
          adminSetPosition: user.profile?.adminSetPosition || '',
          hireDate: user.profile?.hireDate || user.hireDate || ''
        })));
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('載入用戶列表失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPermissions = async (user: UserWithPermissions, permissions: any) => {
    try {
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/admin/users/${user.id}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ permissions })
      });

      if (response.ok) {
        toast.success('權限更新成功');
        loadUsers();
        setShowPermissionDialog(false);
      } else {
        toast.error('權限更新失敗');
      }
    } catch (error) {
      console.error('Failed to update permissions:', error);
      toast.error('權限更新過程發生錯誤');
    }
  };

  const updateUserPosition = async (user: UserWithPermissions, updates: any) => {
    try {
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/admin/users/${user.id}/position`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        toast.success('職位更新成功');
        loadUsers();
      } else {
        toast.error('職位更新失敗');
      }
    } catch (error) {
      console.error('Failed to update position:', error);
      toast.error('職位更新過程發生錯誤');
    }
  };

  const createNewUser = async () => {
    if (!newUserData.name || !newUserData.position) {
      toast.error('請填寫姓名和職位');
      return;
    }

    try {
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(newUserData)
      });

      if (response.ok) {
        toast.success('新用戶建立成功');
        loadUsers();
        setShowAddUserDialog(false);
        setNewUserData({
          name: '',
          position: '',
          virtualPosition: '',
          adminSetPosition: '',
          department: '',
          hireDate: new Date().toISOString().split('T')[0]
        });
      } else {
        toast.error('新用戶建立失敗');
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      toast.error('建立用戶過程發生錯誤');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('確定要刪除此用戶嗎？此操作無法復原。')) return;

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
        toast.error('用戶刪除失敗');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('刪除用戶過程發生錯誤');
    }
  };

  const renderPermissionDialog = () => {
    if (!selectedUser) return null;

    const userPermissions = selectedUser.permissions || {
      canView: [],
      canEdit: [],
      canManage: []
    };

    const handlePermissionChange = (area: string, type: 'canView' | 'canEdit' | 'canManage', checked: boolean) => {
      const newPermissions = {
        canView: userPermissions.canView || [],
        canEdit: userPermissions.canEdit || [],
        canManage: userPermissions.canManage || []
      };
      
      if (checked) {
        if (!newPermissions[type].includes(area)) {
          newPermissions[type].push(area);
        }
      } else {
        newPermissions[type] = newPermissions[type].filter(p => p !== area);
      }
      setSelectedUser({
        ...selectedUser,
        permissions: newPermissions
      });
    };

    return (
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>權限管理 - {selectedUser.name}</DialogTitle>
            <DialogDescription>
              設定用戶的觀看、編輯和管理權限
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <Eye size={16} className="text-blue-500" />
                  <span>觀看權限</span>
                </h4>
                <div className="space-y-2">
                  {PERMISSION_AREAS.map((area) => (
                    <div key={area.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`view-${area.id}`}
                        checked={userPermissions.canView?.includes(area.id) || false}
                        onCheckedChange={(checked) => handlePermissionChange(area.id, 'canView', checked as boolean)}
                      />
                      <label htmlFor={`view-${area.id}`} className="text-sm">
                        {area.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <Edit size={16} className="text-green-500" />
                  <span>編輯權限</span>
                </h4>
                <div className="space-y-2">
                  {PERMISSION_AREAS.map((area) => (
                    <div key={area.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${area.id}`}
                        checked={userPermissions.canEdit?.includes(area.id) || false}
                        onCheckedChange={(checked) => handlePermissionChange(area.id, 'canEdit', checked as boolean)}
                      />
                      <label htmlFor={`edit-${area.id}`} className="text-sm">
                        {area.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <Settings size={16} className="text-red-500" />
                  <span>管理權限</span>
                </h4>
                <div className="space-y-2">
                  {PERMISSION_AREAS.map((area) => (
                    <div key={area.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`manage-${area.id}`}
                        checked={userPermissions.canManage?.includes(area.id) || false}
                        onCheckedChange={(checked) => handlePermissionChange(area.id, 'canManage', checked as boolean)}
                      />
                      <label htmlFor={`manage-${area.id}`} className="text-sm">
                        {area.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setShowPermissionDialog(false)}
            >
              取消
            </Button>
            <Button
              onClick={() => updateUserPermissions(selectedUser, selectedUser.permissions)}
              className="flex items-center space-x-1"
            >
              <Save size={14} />
              <span>儲存權限</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
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
            <span>返回管理中心</span>
          </Button>
          <Shield className="text-blue-500" size={20} />
          <div>
            <h1 className="text-xl font-semibold text-gray-800">權限管理系統</h1>
            <p className="text-sm text-gray-600">管理用戶權限和職位設定</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Action buttons */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              onClick={() => setShowAddUserDialog(true)}
              className="flex items-center space-x-1"
            >
              <Plus size={14} />
              <span>新增用戶</span>
            </Button>
          </div>
        </div>

        {/* Users grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card key={user.id} className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{user.avatar}</span>
                    <div>
                      <CardTitle className="text-base">{user.name}</CardTitle>
                      <p className="text-sm text-gray-600">{user.position}</p>
                      {user.virtualPosition && (
                        <p className="text-xs text-purple-600">虛擬: {user.virtualPosition}</p>
                      )}
                      {user.adminSetPosition && (
                        <p className="text-xs text-blue-600">管理員設定: {user.adminSetPosition}</p>
                      )}
                      {user.hireDate && (
                        <p className="text-xs text-green-600">
                          入職: {new Date(user.hireDate).toLocaleDateString('zh-TW')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    觀看: {user.permissions?.canView?.length || 0}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    編輯: {user.permissions?.canEdit?.length || 0}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    管理: {user.permissions?.canManage?.length || 0}
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowPermissionDialog(true);
                    }}
                    className="flex-1"
                  >
                    <Shield size={12} className="mr-1" />
                    權限
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {renderPermissionDialog()}

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新增用戶</DialogTitle>
            <DialogDescription>
              建立新的用戶帳號
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                placeholder="請輸入姓名"
              />
            </div>

            <div>
              <Label htmlFor="position">職位</Label>
              <Select
                value={newUserData.position}
                onValueChange={(value) => setNewUserData({ ...newUserData, position: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選擇職位" />
                </SelectTrigger>
                <SelectContent>
                  {POSITION_OPTIONS.map((pos) => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="virtualPosition">虛擬職位（選填）</Label>
              <Input
                id="virtualPosition"
                value={newUserData.virtualPosition}
                onChange={(e) => setNewUserData({ ...newUserData, virtualPosition: e.target.value })}
                placeholder="虛擬職位"
              />
            </div>

            <div>
              <Label htmlFor="adminSetPosition">管理員設定職位（選填）</Label>
              <Input
                id="adminSetPosition"
                value={newUserData.adminSetPosition}
                onChange={(e) => setNewUserData({ ...newUserData, adminSetPosition: e.target.value })}
                placeholder="管理員設定職位"
              />
            </div>

            <div>
              <Label htmlFor="department">部門</Label>
              <Input
                id="department"
                value={newUserData.department}
                onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
                placeholder="部門名稱"
              />
            </div>

            <div>
              <Label htmlFor="hireDate">入職日期</Label>
              <Input
                id="hireDate"
                type="date"
                value={newUserData.hireDate}
                onChange={(e) => setNewUserData({ ...newUserData, hireDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setShowAddUserDialog(false)}
            >
              取消
            </Button>
            <Button
              onClick={createNewUser}
              className="flex items-center space-x-1"
            >
              <Plus size={14} />
              <span>建立用戶</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}