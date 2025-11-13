import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { History, Star, Bug, Plus, Edit, Users, Shield } from 'lucide-react';

interface VersionInfo {
  version: string;
  date: string;
  timestamp: string; // Added precise timestamp for relative time calculation
  title: string;
  changes: {
    type: 'new' | 'fix' | 'improve' | 'update';
    description: string;
  }[];
  highlights?: string[];
}

const versionHistory: VersionInfo[] = [
  {
    version: '1.04',
    date: '2025-09-10',
    timestamp: '2025-09-10T14:30:00Z',
    title: '同帳號防多裝置登入、自動除錯功能與在線狀態顯示版本',
    changes: [
      { type: 'new', description: '實現同帳號不得多裝置登入防護機制' },
      { type: 'new', description: '添加會話令牌管理系統，防止密碼洩露造成的安全問題' },
      { type: 'new', description: '創建全新的DebugPanel自動除錯功能面板' },
      { type: 'new', description: '實現系統狀態即時監控：用戶數、在線用戶、錯誤統計' },
      { type: 'new', description: '添加在線用戶列表顯示功能，包含會話資訊' },
      { type: 'new', description: '建立自動錯誤收集與記錄系統' },
      { type: 'improve', description: '優化在線狀態顯示：5分鐘內在線、30分鐘內最近活躍' },
      { type: 'new', description: '添加登入時間顯示功能：X分鐘前、X小時前、X天前' },
      { type: 'fix', description: '修復AdminPanel任務管理按鈕點擊問題' },
      { type: 'new', description: '實現會話驗證與自動恢復登入狀態功能' }
    ],
    highlights: [
      '防多裝置登入機制大幅提升帳號安全性',
      '即時系統監控與自動除錯功能',
      '完整的在線狀態與時間顯示系統',
      '自動錯誤收集與追蹤功能'
    ]
  },
  {
    version: '1.03',
    date: '2025-09-08',
    timestamp: '2025-09-08T10:15:00Z',
    title: '個人檔案編輯功能修正版本',
    changes: [
      { type: 'fix', description: '修正個人檔案編輯功能中的ID比較邏輯錯誤' },
      { type: 'new', description: '創建獨立的ProfileEditDialog組件，提供更好的編輯體驗' },
      { type: 'improve', description: '重構PeopleDirectory組件，移除舊的編輯邏輯' },
      { type: 'new', description: '添加詳細的調試信息幫助問題診斷' },
      { type: 'update', description: '在所有主要界面統一顯示版本信息' },
      { type: 'improve', description: '優化頭像選擇功能和興趣管理功能' },
      { type: 'new', description: '創建可點擊的版本歷史對話框，顯示過去版本更新資訊' }
    ],
    highlights: [
      '解決了個人檔案編輯按鈕無法正確顯示的問題',
      '用戶現在可以正常編輯自己的個人檔案',
      '所有界面都顯示統一的版本信息',
      '新增可點擊的版本歷史功能'
    ]
  },
  {
    version: '1.02',
    date: '2025-09-05',
    timestamp: '2025-09-05T16:20:00Z',
    title: '在線狀態與權限優化版本',
    changes: [
      { type: 'new', description: '添加用戶在線狀態顯示功能' },
      { type: 'new', description: '實現多久時間前登入的資訊顯示' },
      { type: 'update', description: '管理員職位統一改為GOD' },
      { type: 'update', description: '部門選項改為下拉式選項：信義、內湖、總部' },
      { type: 'improve', description: '優化權限管理系統，管理員在管理介面可看到自己' },
      { type: 'fix', description: '修正其他使用者無法看到管理員的問題' },
      { type: 'new', description: '公會城堡新增公司制度、獎金制度、福利等內容' }
    ],
    highlights: [
      '新增實時在線狀態追蹤',
      '完善的權限管理系統',
      '豐富的公會城堡內容'
    ]
  },
  {
    version: '1.01',
    date: '2025-09-01',
    timestamp: '2025-09-01T09:00:00Z',
    title: '基礎系統建立版本',
    changes: [
      { type: 'new', description: '建立Guild Order冒險者公會培訓系統' },
      { type: 'new', description: '實現四位數密碼登入系統' },
      { type: 'new', description: '創建RPG風格的角色設定系統' },
      { type: 'new', description: '建立Duolingo風格的學習地圖' },
      { type: 'new', description: '實現SOP培訓任務的逐步進展追蹤' },
      { type: 'new', description: '建立基礎權限管理：絕對神>管理職>內、外場正職>內、外場兼職' },
      { type: 'new', description: '實現Supabase後端數據保存功能' },
      { type: 'new', description: '建立管理員功能：新增帳號、設定觀看範圍' }
    ],
    highlights: [
      '完整的RPG風格培訓系統',
      '多層級權限管理',
      '雲端數據保存功能'
    ]
  }
];

interface VersionHistoryProps {
  currentVersion?: string;
  trigger?: React.ReactNode;
  className?: string;
}

export function VersionHistory({ currentVersion = '1.04', trigger, className }: VersionHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate relative time
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const releaseTime = new Date(timestamp);
    const diffInMs = now.getTime() - releaseTime.getTime();
    
    // Handle future dates (should not happen but just in case)
    if (diffInMs < 0) return '未來';
    
    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    
    if (minutes < 1) return '剛剛';
    if (minutes < 60) return `${minutes}分鐘前`;
    if (hours < 24) return `${hours}小時前`;
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;
    if (weeks < 4) return `${weeks}週前`;
    if (months < 12) return `${months}個月前`;
    
    const years = Math.floor(months / 12);
    return `${years}年前`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new': return <Plus size={12} className="text-green-500" />;
      case 'fix': return <Bug size={12} className="text-red-500" />;
      case 'improve': return <Star size={12} className="text-blue-500" />;
      case 'update': return <Edit size={12} className="text-orange-500" />;
      default: return <Edit size={12} className="text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'new': return '新功能';
      case 'fix': return '修復';
      case 'improve': return '改善';
      case 'update': return '更新';
      default: return '變更';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'fix': return 'bg-red-100 text-red-800';
      case 'improve': return 'bg-blue-100 text-blue-800';
      case 'update': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const defaultTrigger = (
    <button
      onClick={() => setIsOpen(true)}
      className={`text-xs font-mono hover:bg-black/10 px-2 py-1 rounded border transition-all duration-200 ${className || 'text-yellow-400 bg-black/20 border-yellow-400/20 hover:border-yellow-400/40'}`}
    >
      Version 1.04
    </button>
  );

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        defaultTrigger
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <History className="text-blue-500" size={20} />
              <span>Guild Order 版本歷史</span>
              <Badge className="bg-yellow-100 text-yellow-800">
                當前版本: 1.04
              </Badge>
            </DialogTitle>
            <DialogDescription>
              查看Guild Order冒險者培訓管理系統的版本更新歷史和功能變更記錄
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              {versionHistory.map((version) => (
                <div key={version.version} className="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-white to-gray-50">
                  {/* Version Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Badge 
                        className="text-sm px-3 py-1 bg-gray-100 text-gray-800"
                      >
                        Version {version.version}
                      </Badge>
                      <div className="flex flex-col text-sm text-gray-500">
                        <span>{version.date}</span>
                        <span className="text-xs text-gray-400">{getRelativeTime(version.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Version Title */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {version.title}
                  </h3>

                  {/* Highlights */}
                  {version.highlights && version.highlights.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                        <Star size={14} className="mr-1" />
                        主要亮點
                      </h4>
                      <ul className="space-y-1">
                        {version.highlights.map((highlight, index) => (
                          <li key={index} className="text-sm text-blue-700 flex items-start">
                            <span className="mr-2">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Changes */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700 mb-3">詳細更新內容：</h4>
                    {version.changes.map((change, index) => (
                      <div key={index} className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50">
                        <div className="flex items-center space-x-1 mt-0.5">
                          {getTypeIcon(change.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge className={`text-xs px-2 py-0.5 ${getTypeBadgeColor(change.type)}`}>
                              {getTypeLabel(change.type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {change.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield size={14} />
              <span>Guild Order 冒險者培訓管理系統</span>
            </div>
            <Button onClick={() => setIsOpen(false)} variant="outline">
              關閉
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}