import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ArrowLeft, Plus, Edit, Trash2, Target, Users, Clock, Star, Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { UserProfile } from './CharacterSetup';

interface TaskManagerProps {
  currentUser: UserProfile;
  onBack: () => void;
}

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  targetPosition: string[];
  reward: string;
  deadline?: string;
  status: 'active' | 'completed' | 'expired';
  progress?: number;
  requirements?: string[];
  sopLinks?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const TASK_CATEGORIES = [
  { id: 'training', name: '培訓任務', color: 'bg-blue-500' },
  { id: 'skill', name: '技能認證', color: 'bg-green-500' },
  { id: 'evaluation', name: '評估考核', color: 'bg-orange-500' },
  { id: 'project', name: '專案任務', color: 'bg-purple-500' },
  { id: 'general', name: '一般任務', color: 'bg-gray-500' }
];

const POSITION_OPTIONS = [
  '外場', '外場PT', '內場', '內場PT', '管理職', '絕對神', '全體'
];

export function TaskManager({ currentUser, onBack }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: '',
    targetPosition: [] as string[],
    reward: '',
    deadline: '',
    requirements: [''],
    sopLinks: ['']
  });

  const canManageTasks = currentUser.position === '管理職' || currentUser.position === '絕對神';

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/tasks`, {
        headers: {
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast.error('載入任務失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.category) {
      toast.error('請填寫任務標題、描述和分類');
      return;
    }

    try {
      const taskData = {
        ...newTask,
        requirements: newTask.requirements.filter(req => req.trim()),
        sopLinks: newTask.sopLinks.filter(link => link.trim()),
        createdBy: currentUser.id,
        status: 'active'
      };

      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(taskData)
      });

      if (response.ok) {
        toast.success('任務建立成功');
        loadTasks();
        setShowCreateDialog(false);
        resetNewTask();
      } else {
        toast.error('任務建立失敗');
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('建立任務過程發生錯誤');
    }
  };

  const updateTask = async () => {
    if (!selectedTask) return;

    try {
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/tasks/${selectedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(selectedTask)
      });

      if (response.ok) {
        toast.success('任務更新成功');
        loadTasks();
        setShowEditDialog(false);
        setSelectedTask(null);
      } else {
        toast.error('任務更新失敗');
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('更新任務過程發生錯誤');
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('確定要刪除此任務嗎？此操作無法復原。')) return;

    try {
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        }
      });

      if (response.ok) {
        toast.success('任務刪除成功');
        loadTasks();
      } else {
        toast.error('任務刪除失敗');
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('刪除任務過程發生錯誤');
    }
  };

  const resetNewTask = () => {
    setNewTask({
      title: '',
      description: '',
      category: '',
      targetPosition: [],
      reward: '',
      deadline: '',
      requirements: [''],
      sopLinks: ['']
    });
  };

  const addRequirement = () => {
    setNewTask({
      ...newTask,
      requirements: [...newTask.requirements, '']
    });
  };

  const updateRequirement = (index: number, value: string) => {
    const requirements = [...newTask.requirements];
    requirements[index] = value;
    setNewTask({ ...newTask, requirements });
  };

  const removeRequirement = (index: number) => {
    setNewTask({
      ...newTask,
      requirements: newTask.requirements.filter((_, i) => i !== index)
    });
  };

  const addSopLink = () => {
    setNewTask({
      ...newTask,
      sopLinks: [...newTask.sopLinks, '']
    });
  };

  const updateSopLink = (index: number, value: string) => {
    const sopLinks = [...newTask.sopLinks];
    sopLinks[index] = value;
    setNewTask({ ...newTask, sopLinks });
  };

  const removeSopLink = (index: number) => {
    setNewTask({
      ...newTask,
      sopLinks: newTask.sopLinks.filter((_, i) => i !== index)
    });
  };

  const getCategoryColor = (categoryId: string) => {
    const category = TASK_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.color || 'bg-gray-500';
  };

  const getCategoryName = (categoryId: string) => {
    const category = TASK_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const isTaskVisibleToUser = (task: Task) => {
    // Safety check for targetPosition array
    const targetPositions = Array.isArray(task.targetPosition) ? task.targetPosition : [];
    
    return targetPositions.includes('全體') || 
           targetPositions.includes(currentUser.position || '') ||
           task.createdBy === currentUser.id;
  };

  const visibleTasks = tasks.filter(isTaskVisibleToUser);

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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="text-blue-500" size={20} />
            <div>
              <h1 className="text-xl font-semibold text-gray-800">任務中心</h1>
              <p className="text-sm text-gray-600">查看和管理培訓任務</p>
            </div>
          </div>
          
          {canManageTasks && (
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center space-x-1"
            >
              <Plus size={14} />
              <span>新增任務</span>
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{visibleTasks.length}</div>
              <div className="text-sm text-gray-600">總任務數</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {visibleTasks.filter(t => t.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">進行中</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {visibleTasks.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">已完成</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {visibleTasks.filter(t => t.status === 'expired').length}
              </div>
              <div className="text-sm text-gray-600">已過期</div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleTasks.map((task) => (
            <Card key={task.id} className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base mb-2">{task.title}</CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={`${getCategoryColor(task.category)} text-white text-xs`}>
                        {getCategoryName(task.category)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {task.status === 'active' ? '進行中' : task.status === 'completed' ? '已完成' : '已過期'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Users size={14} className="text-blue-500" />
                    <span>目標: {Array.isArray(task.targetPosition) ? task.targetPosition.join(', ') : '未指定'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Star size={14} className="text-yellow-500" />
                    <span>獎勵: {task.reward}</span>
                  </div>
                  {task.deadline && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock size={14} className="text-red-500" />
                      <span>截止: {new Date(task.deadline).toLocaleDateString('zh-TW')}</span>
                    </div>
                  )}
                </div>

                {task.requirements && task.requirements.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium mb-1">任務要求:</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {task.requirements.map((req, index) => (
                        <li key={index}>• {req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {task.sopLinks && task.sopLinks.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium mb-1">SOP連結:</h5>
                    <div className="space-y-1">
                      {task.sopLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline block"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {canManageTasks && task.createdBy === currentUser.id && (
                  <div className="flex space-x-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedTask(task);
                        setShowEditDialog(true);
                      }}
                      className="flex-1"
                    >
                      <Edit size={12} className="mr-1" />
                      編輯
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteTask(task.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {visibleTasks.length === 0 && (
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Target size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">尚無任務</h3>
              <p className="text-gray-500">
                {canManageTasks ? '點擊上方「新增任務」按鈕來建立第一個任務' : '目前沒有適合您職位的任務'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Task Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新增任務</DialogTitle>
            <DialogDescription>
              建立新的培訓任務或技能認證
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">任務標題</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="請輸入任務標題"
              />
            </div>

            <div>
              <Label htmlFor="description">任務描述</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="詳細描述任務內容和目標"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">任務分類</Label>
                <Select
                  value={newTask.category}
                  onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇分類" />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reward">任務獎勵</Label>
                <Input
                  id="reward"
                  value={newTask.reward}
                  onChange={(e) => setNewTask({ ...newTask, reward: e.target.value })}
                  placeholder="例: +30 EXP"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="targetPosition">目標職位</Label>
              <Select
                value={newTask.targetPosition[0] || ''}
                onValueChange={(value) => setNewTask({ ...newTask, targetPosition: [value] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選擇目標職位" />
                </SelectTrigger>
                <SelectContent>
                  {POSITION_OPTIONS.map((pos) => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="deadline">截止日期（選填）</Label>
              <Input
                id="deadline"
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              />
            </div>

            <div>
              <Label>任務要求</Label>
              {newTask.requirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    value={req}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder="輸入任務要求"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeRequirement(index)}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addRequirement}
                className="mt-2"
              >
                <Plus size={12} className="mr-1" />
                新增要求
              </Button>
            </div>

            <div>
              <Label>SOP連結</Label>
              {newTask.sopLinks.map((link, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    value={link}
                    onChange={(e) => updateSopLink(index, e.target.value)}
                    placeholder="輸入SOP文件連結"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeSopLink(index)}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addSopLink}
                className="mt-2"
              >
                <Plus size={12} className="mr-1" />
                新增連結
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                resetNewTask();
              }}
            >
              取消
            </Button>
            <Button
              onClick={createTask}
              className="flex items-center space-x-1"
            >
              <Save size={14} />
              <span>建立任務</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>編輯任務</DialogTitle>
            <DialogDescription>
              修改任務內容和設定
            </DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">任務標題</Label>
                <Input
                  id="edit-title"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                  placeholder="請輸入任務標題"
                />
              </div>

              <div>
                <Label htmlFor="edit-description">任務描述</Label>
                <Textarea
                  id="edit-description"
                  value={selectedTask.description}
                  onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                  placeholder="詳細描述任務內容和目標"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">任務分類</Label>
                  <Select
                    value={selectedTask.category}
                    onValueChange={(value) => setSelectedTask({ ...selectedTask, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇分類" />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-reward">任務獎勵</Label>
                  <Input
                    id="edit-reward"
                    value={selectedTask.reward}
                    onChange={(e) => setSelectedTask({ ...selectedTask, reward: e.target.value })}
                    placeholder="例: +30 EXP"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-targetPosition">目標職位</Label>
                <Select
                  value={Array.isArray(selectedTask.targetPosition) ? selectedTask.targetPosition[0] || '' : ''}
                  onValueChange={(value) => setSelectedTask({ ...selectedTask, targetPosition: [value] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇目標職位" />
                  </SelectTrigger>
                  <SelectContent>
                    {POSITION_OPTIONS.map((pos) => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-deadline">截止日期（選填）</Label>
                <Input
                  id="edit-deadline"
                  type="date"
                  value={selectedTask.deadline || ''}
                  onChange={(e) => setSelectedTask({ ...selectedTask, deadline: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-status">任務狀態</Label>
                <Select
                  value={selectedTask.status}
                  onValueChange={(value: 'active' | 'completed' | 'expired') => 
                    setSelectedTask({ ...selectedTask, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇狀態" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">進行中</SelectItem>
                    <SelectItem value="completed">已完成</SelectItem>
                    <SelectItem value="expired">已過期</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setSelectedTask(null);
              }}
            >
              取消
            </Button>
            <Button
              onClick={updateTask}
              className="flex items-center space-x-1"
            >
              <Save size={14} />
              <span>儲存更改</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}