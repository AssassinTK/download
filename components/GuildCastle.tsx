import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import { 
  ArrowLeft,
  Crown,
  Edit,
  Save,
  Plus,
  Trash2,
  Users,
  Trophy,
  Star,
  DollarSign,
  Gift,
  Shield,
  Sparkles,
  FileText,
  Clock
} from 'lucide-react';
import { UserProfile } from './CharacterSetup';
import { toast } from 'sonner@2.0.3';

interface GuildCastleProps {
  currentUser: UserProfile;
  isAdmin: boolean;
  onBack: () => void;
}

interface CastleContent {
  id: string;
  type: 'company_rules' | 'bonus_system' | 'benefits' | 'announcements';
  title: string;
  content: string;
  lastUpdated: string;
  updatedBy: string;
  order: number;
}

interface EditingContent {
  id?: string;
  type: CastleContent['type'];
  title: string;
  content: string;
}

const CONTENT_TYPES = [
  { id: 'company_rules', name: '公司制度', icon: FileText, color: 'bg-blue-500' },
  { id: 'bonus_system', name: '獎金制度', icon: DollarSign, color: 'bg-green-500' },
  { id: 'benefits', name: '福利制度', icon: Gift, color: 'bg-purple-500' },
  { id: 'announcements', name: '公告事項', icon: Crown, color: 'bg-orange-500' }
] as const;

export function GuildCastle({ currentUser, isAdmin, onBack }: GuildCastleProps) {
  const [contents, setContents] = useState<CastleContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingContent, setEditingContent] = useState<EditingContent | null>(null);
  const [selectedType, setSelectedType] = useState<CastleContent['type']>('company_rules');

  useEffect(() => {
    loadCastleContent();
  }, []);

  const loadCastleContent = async () => {
    try {
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/guild-castle/content`, {
        headers: {
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContents(data.contents || []);
      } else {
        console.error('Failed to load castle content');
      }
    } catch (error) {
      console.error('Error loading castle content:', error);
      toast.error('載入城堡內容失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const saveContent = async () => {
    if (!editingContent || !editingContent.title.trim() || !editingContent.content.trim()) {
      toast.error('請填寫標題和內容');
      return;
    }

    try {
      const contentData = {
        ...editingContent,
        updatedBy: currentUser.name,
        lastUpdated: new Date().toISOString()
      };

      const method = editingContent.id ? 'PUT' : 'POST';
      const url = editingContent.id 
        ? `https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/guild-castle/content/${editingContent.id}`
        : `https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/guild-castle/content`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(contentData)
      });

      if (response.ok) {
        toast.success(editingContent.id ? '內容更新成功' : '內容新增成功');
        setShowEditDialog(false);
        setEditingContent(null);
        loadCastleContent();
      } else {
        toast.error('儲存失敗');
      }
    } catch (error) {
      console.error('Failed to save content:', error);
      toast.error('儲存過程發生錯誤');
    }
  };

  const deleteContent = async (contentId: string) => {
    if (!confirm('確定要刪除此內容嗎？此操作無法復原。')) return;

    try {
      const response = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/guild-castle/content/${contentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        }
      });

      if (response.ok) {
        toast.success('內容刪除成功');
        loadCastleContent();
      } else {
        toast.error('刪除失敗');
      }
    } catch (error) {
      console.error('Failed to delete content:', error);
      toast.error('刪除過程發生錯誤');
    }
  };

  const startEditing = (content?: CastleContent) => {
    if (content) {
      setEditingContent({
        id: content.id,
        type: content.type,
        title: content.title,
        content: content.content
      });
    } else {
      setEditingContent({
        type: selectedType,
        title: '',
        content: ''
      });
    }
    setShowEditDialog(true);
  };

  const getContentsByType = (type: CastleContent['type']) => {
    return contents.filter(content => content.type === type).sort((a, b) => a.order - b.order);
  };

  const getTypeInfo = (type: CastleContent['type']) => {
    return CONTENT_TYPES.find(t => t.id === type);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex items-center space-x-2 text-white">
          <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <span>載入城堡內容中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Epic castle background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-sm border-b border-yellow-400/30 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
            >
              <ArrowLeft size={16} className="mr-2" />
              返回地圖
            </Button>
            <div className="flex items-center space-x-3">
              <div className="text-5xl">🏰</div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                  Guild Order 城堡
                </h1>
                <p className="text-gray-300">
                  公司制度 • 獎金福利 • 最新公告
                </p>
              </div>
            </div>
          </div>

          {isAdmin && (
            <Button
              onClick={() => startEditing()}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
            >
              <Plus size={16} className="mr-2" />
              新增內容
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Type Navigation */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {CONTENT_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            const contentCount = getContentsByType(type.id).length;
            
            return (
              <Button
                key={type.id}
                variant={isSelected ? "default" : "outline"}
                onClick={() => setSelectedType(type.id)}
                className={`${isSelected 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-400 text-white' 
                  : 'bg-slate-800/50 border-slate-600 text-gray-300 hover:bg-slate-700/50'
                } backdrop-blur-sm`}
              >
                <Icon size={16} className="mr-2" />
                {type.name}
                {contentCount > 0 && (
                  <Badge className="ml-2 bg-white/20 text-white">
                    {contentCount}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {/* Content Display */}
        <div className="max-w-4xl mx-auto">
          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="space-y-6">
              {getContentsByType(selectedType).length === 0 ? (
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-600 text-center py-12">
                  <CardContent>
                    <div className="text-6xl mb-4">📜</div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                      尚無{getTypeInfo(selectedType)?.name}內容
                    </h3>
                    <p className="text-gray-400">
                      {isAdmin ? '點擊上方「新增內容」按鈕來添加第一個項目' : '管理員尚未添加此類型的內容'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                getContentsByType(selectedType).map((content) => {
                  const typeInfo = getTypeInfo(content.type);
                  const Icon = typeInfo?.icon || FileText;
                  
                  return (
                    <Card key={content.id} className="bg-slate-800/70 backdrop-blur-sm border-slate-600">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${typeInfo?.color} text-white`}>
                              <Icon size={20} />
                            </div>
                            <div>
                              <CardTitle className="text-xl text-white">{content.title}</CardTitle>
                              <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                                <Users size={12} />
                                <span>更新者: {content.updatedBy}</span>
                                <Clock size={12} />
                                <span>更新時間: {new Date(content.lastUpdated).toLocaleDateString('zh-TW')}</span>
                              </div>
                            </div>
                          </div>
                          
                          {isAdmin && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditing(content)}
                                className="border-slate-600 text-gray-300 hover:bg-slate-700/50"
                              >
                                <Edit size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteContent(content.id)}
                                className="border-red-600 text-red-400 hover:bg-red-900/50"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-invert max-w-none">
                          <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {content.content}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingContent?.id ? '編輯內容' : '新增內容'}
            </DialogTitle>
            <DialogDescription>
              {editingContent?.id ? '修改現有的城堡內容' : '為城堡添加新的內容項目'}
            </DialogDescription>
          </DialogHeader>

          {editingContent && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="content-type">內容類型</Label>
                <select
                  id="content-type"
                  value={editingContent.type}
                  onChange={(e) => setEditingContent({
                    ...editingContent,
                    type: e.target.value as CastleContent['type']
                  })}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  {CONTENT_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="content-title">標題</Label>
                <Input
                  id="content-title"
                  value={editingContent.title}
                  onChange={(e) => setEditingContent({
                    ...editingContent,
                    title: e.target.value
                  })}
                  placeholder="請輸入內容標題"
                />
              </div>

              <div>
                <Label htmlFor="content-body">內容</Label>
                <Textarea
                  id="content-body"
                  value={editingContent.content}
                  onChange={(e) => setEditingContent({
                    ...editingContent,
                    content: e.target.value
                  })}
                  placeholder="請輸入詳細內容"
                  rows={12}
                  className="min-h-[300px]"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setEditingContent(null);
              }}
            >
              取消
            </Button>
            <Button
              onClick={saveContent}
              className="flex items-center space-x-2"
            >
              <Save size={14} />
              <span>儲存</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}