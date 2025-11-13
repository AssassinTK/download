import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Edit, 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  BookOpen,
  Link,
  Clock,
  Info,
  Target
} from 'lucide-react';
import { UserProfile } from './CharacterSetup';
import { toast } from 'sonner@2.0.3';

interface ContentEditorProps {
  currentAdmin: UserProfile;
  onBack: () => void;
}

interface TrainingContent {
  id: string;
  path: 'indoor' | 'outdoor' | 'newbie';
  categoryId: string;
  categoryTitle: string;
  subTasks: {
    id: string;
    title: string;
    description: string;
    sopLink?: string;
    clockInfo?: {
      location: string;
      workTime: string;
      breakTime: string;
    };
    additionalInfo?: string[];
  }[];
}

interface TaskContent {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: string;
}

export function ContentEditor({ currentAdmin, onBack }: ContentEditorProps) {
  const [trainingContents, setTrainingContents] = useState<TrainingContent[]>([]);
  const [tasks, setTasks] = useState<TaskContent[]>([]);
  const [activeTab, setActiveTab] = useState<'training' | 'tasks'>('training');
  const [isLoading, setIsLoading] = useState(true);
  const [editingContent, setEditingContent] = useState<TrainingContent | null>(null);
  const [editingTask, setEditingTask] = useState<TaskContent | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      // Load training content
      const trainingResponse = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/admin/training-content`, {
        headers: {
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        }
      });

      if (trainingResponse.ok) {
        const trainingData = await trainingResponse.json();
        setTrainingContents(trainingData.content || []);
      }

      // Load tasks
      const tasksResponse = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/admin/tasks`, {
        headers: {
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        }
      });

      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        setTasks(tasksData.tasks || []);
      }

    } catch (error) {
      console.error('Failed to load content:', error);
      toast.error('載入內容失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const saveTrainingContent = async (content: TrainingContent) => {
    try {
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/admin/training-content/${content.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ content })
      });

      if (response.ok) {
        toast.success('培訓內容保存成功');
        setEditingContent(null);
        loadContent();
      } else {
        toast.error('保存失敗');
      }
    } catch (error) {
      console.error('Failed to save training content:', error);
      toast.error('保存過程發生錯誤');
    }
  };

  const saveTask = async (task: TaskContent) => {
    try {
      const method = task.id ? 'PUT' : 'POST';
      const url = task.id 
        ? `https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/admin/tasks/${task.id}`
        : `https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/admin/tasks`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ task })
      });

      if (response.ok) {
        toast.success(task.id ? '任務更新成功' : '任務創建成功');
        setEditingTask(null);
        setShowAddDialog(false);
        loadContent();
      } else {
        toast.error('保存失敗');
      }
    } catch (error) {
      console.error('Failed to save task:', error);
      toast.error('保存過程發生錯誤');
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('確定要刪除此任務嗎？')) return;

    try {
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/admin/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        }
      });

      if (response.ok) {
        toast.success('任務刪除成功');
        loadContent();
      } else {
        toast.error('刪除失敗');
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('刪除過程發生錯誤');
    }
  };

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
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-1"
          >
            <ArrowLeft size={16} />
            <span>返回管理中心</span>
          </Button>
          <Edit className="text-blue-500" size={20} />
          <div>
            <h1 className="text-xl font-semibold text-gray-800">內容編輯器</h1>
            <p className="text-sm text-gray-600">編輯培訓內容與任務資訊</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6">
          <Button
            variant={activeTab === 'training' ? 'default' : 'outline'}
            onClick={() => setActiveTab('training')}
            className="flex items-center space-x-2"
          >
            <BookOpen size={16} />
            <span>培訓內容</span>
          </Button>
          <Button
            variant={activeTab === 'tasks' ? 'default' : 'outline'}
            onClick={() => setActiveTab('tasks')}
            className="flex items-center space-x-2"
          >
            <Target size={16} />
            <span>任務管理</span>
          </Button>
        </div>

        {activeTab === 'training' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">培訓內容管理</h2>
            {trainingContents.map((content) => (
              <Card key={content.id} className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Badge className="capitalize">{content.path}</Badge>
                      <span>{content.categoryTitle}</span>
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingContent(content)}
                    >
                      <Edit size={14} />
                      編輯
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {content.subTasks.map((subTask) => (
                      <div key={subTask.id} className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium">{subTask.title}</h4>
                        <p className="text-sm text-gray-600">{subTask.description}</p>
                        {subTask.sopLink && (
                          <div className="flex items-center space-x-1 mt-2">
                            <Link size={12} />
                            <span className="text-xs text-blue-600">{subTask.sopLink}</span>
                          </div>
                        )}
                        {subTask.clockInfo && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Clock size={12} />
                            <span className="text-xs text-gray-600">
                              {subTask.clockInfo.location} • {subTask.clockInfo.workTime}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">任務管理</h2>
              <Button
                onClick={() => {
                  setEditingTask({
                    id: '',
                    title: '',
                    description: '',
                    category: '',
                    priority: 'medium'
                  });
                  setShowAddDialog(true);
                }}
                className="flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>新增任務</span>
              </Button>
            </div>
            
            <div className="grid gap-4">
              {tasks.map((task) => (
                <Card key={task.id} className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">{task.category}</Badge>
                          <Badge className={
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {task.priority}
                          </Badge>
                          {task.dueDate && (
                            <span className="text-xs text-gray-500">到期: {task.dueDate}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingTask(task);
                            setShowAddDialog(true);
                          }}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTask(task.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Training Content Edit Dialog */}
      {editingContent && (
        <Dialog open={!!editingContent} onOpenChange={() => setEditingContent(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>編輯培訓內容 - {editingContent.categoryTitle}</DialogTitle>
              <DialogDescription>
                編輯此類別下的所有子任務內容，包括標題、描述、SOP連結和打卡資訊
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {editingContent.subTasks.map((subTask, index) => (
                <Card key={subTask.id} className="bg-gray-50">
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <Label>標題</Label>
                      <Input
                        value={subTask.title}
                        onChange={(e) => {
                          const updated = { ...editingContent };
                          updated.subTasks[index].title = e.target.value;
                          setEditingContent(updated);
                        }}
                      />
                    </div>
                    <div>
                      <Label>描述</Label>
                      <Textarea
                        value={subTask.description}
                        onChange={(e) => {
                          const updated = { ...editingContent };
                          updated.subTasks[index].description = e.target.value;
                          setEditingContent(updated);
                        }}
                      />
                    </div>
                    <div>
                      <Label>SOP連結</Label>
                      <Input
                        value={subTask.sopLink || ''}
                        onChange={(e) => {
                          const updated = { ...editingContent };
                          updated.subTasks[index].sopLink = e.target.value;
                          setEditingContent(updated);
                        }}
                        placeholder="/sop/example.pdf"
                      />
                    </div>
                    {subTask.clockInfo && (
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label>打卡地點</Label>
                          <Input
                            value={subTask.clockInfo.location}
                            onChange={(e) => {
                              const updated = { ...editingContent };
                              updated.subTasks[index].clockInfo!.location = e.target.value;
                              setEditingContent(updated);
                            }}
                          />
                        </div>
                        <div>
                          <Label>工作時間</Label>
                          <Input
                            value={subTask.clockInfo.workTime}
                            onChange={(e) => {
                              const updated = { ...editingContent };
                              updated.subTasks[index].clockInfo!.workTime = e.target.value;
                              setEditingContent(updated);
                            }}
                          />
                        </div>
                        <div>
                          <Label>休息時間</Label>
                          <Input
                            value={subTask.clockInfo.breakTime}
                            onChange={(e) => {
                              const updated = { ...editingContent };
                              updated.subTasks[index].clockInfo!.breakTime = e.target.value;
                              setEditingContent(updated);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingContent(null)}>
                  取消
                </Button>
                <Button onClick={() => saveTrainingContent(editingContent)}>
                  <Save size={16} className="mr-2" />
                  保存
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Task Edit/Add Dialog */}
      {showAddDialog && editingTask && (
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTask.id ? '編輯任務' : '新增任務'}</DialogTitle>
              <DialogDescription>
                {editingTask.id ? '修改現有任務的詳細資訊' : '創建新的任務項目'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>標題</Label>
                <Input
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  placeholder="任務標題"
                />
              </div>
              <div>
                <Label>描述</Label>
                <Textarea
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  placeholder="任務描述"
                />
              </div>
              <div>
                <Label>分類</Label>
                <Input
                  value={editingTask.category}
                  onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                  placeholder="任務分類"
                />
              </div>
              <div>
                <Label>優先級</Label>
                <select
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as any })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>
              <div>
                <Label>到期日期</Label>
                <Input
                  type="date"
                  value={editingTask.dueDate || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  取消
                </Button>
                <Button onClick={() => saveTask(editingTask)}>
                  <Save size={16} className="mr-2" />
                  保存
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}