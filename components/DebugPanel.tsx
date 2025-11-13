import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Activity, 
  Users, 
  AlertTriangle, 
  RefreshCw, 
  Monitor, 
  Clock,
  Circle,
  User,
  ArrowLeft
} from 'lucide-react';
import { UserProfile } from './CharacterSetup';
import { toast } from 'sonner@2.0.3';

interface DebugPanelProps {
  currentAdmin: UserProfile;
  onBack: () => void;
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  onlineUsers: number;
  totalTasks: number;
  guildContentItems: number;
  serverUptime: number;
  memoryUsage: {
    users: number;
    tasks: number;
    total: number;
  };
}

interface OnlineUser {
  id: string;
  name: string;
  lastActive: string;
  sessionToken: string;
}

interface ErrorLog {
  id: number;
  error: string;
  context: string;
  timestamp: string;
}

export function DebugPanel({ currentAdmin, onBack }: DebugPanelProps) {
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    loadSystemData();
    const interval = setInterval(loadSystemData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSystemData = async () => {
    try {
      setIsLoading(true);
      
      // Load system status
      const statusResponse = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/admin/debug/system-status`, {
        headers: {
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        }
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setSystemStats(statusData.systemStats);
        setOnlineUsers(statusData.onlineUsers);
      }

      // Load error logs
      const logsResponse = await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/admin/debug/error-logs`, {
        headers: {
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        }
      });

      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        setErrorLogs(logsData.errorLogs);
      }

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load system data:', error);
      toast.error('載入系統資料失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return '剛剛';
    if (diffMins < 60) return `${diffMins}分鐘前`;
    if (diffHours < 24) return `${diffHours}小時前`;
    return `${diffDays}天前`;
  };

  const getStatusColor = (lastActive: string) => {
    const now = new Date();
    const time = new Date(lastActive);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 5) return 'text-green-500'; // Online
    if (diffMins < 30) return 'text-yellow-500'; // Away
    return 'text-gray-500'; // Offline
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-purple-500/30 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="bg-white/10 border-purple-400/50 text-white hover:bg-white/20"
            >
              <ArrowLeft size={16} className="mr-1" />
              返回
            </Button>
            <Monitor className="text-purple-400" size={20} />
            <div>
              <h1 className="text-xl font-semibold text-white">系統除錯面板</h1>
              <p className="text-sm text-purple-300">即時系統監控與錯誤追蹤</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={loadSystemData}
              disabled={isLoading}
              size="sm"
              variant="outline"
              className="bg-white/10 border-purple-400/50 text-white hover:bg-white/20"
            >
              <RefreshCw size={14} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
            <div className="text-xs text-purple-300">
              最後更新: {lastRefresh.toLocaleTimeString('zh-TW')}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-sm">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-purple-600">
              系統概覽
            </TabsTrigger>
            <TabsTrigger value="users" className="text-white data-[state=active]:bg-purple-600">
              在線用戶
            </TabsTrigger>
            <TabsTrigger value="errors" className="text-white data-[state=active]:bg-purple-600">
              錯誤日誌
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* System Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-300">總用戶數</p>
                      <p className="text-2xl font-bold text-white">
                        {systemStats?.totalUsers || 0}
                      </p>
                    </div>
                    <Users className="text-purple-400" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-sm border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-300">在線用戶</p>
                      <p className="text-2xl font-bold text-white">
                        {systemStats?.onlineUsers || 0}
                      </p>
                    </div>
                    <Circle className="text-green-400 fill-current" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-sm border-yellow-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-300">活躍用戶</p>
                      <p className="text-2xl font-bold text-white">
                        {systemStats?.activeUsers || 0}
                      </p>
                    </div>
                    <Activity className="text-yellow-400" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-sm border-red-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-300">錯誤數量</p>
                      <p className="text-2xl font-bold text-white">
                        {errorLogs.length}
                      </p>
                    </div>
                    <AlertTriangle className="text-red-400" size={24} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Memory Usage */}
            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">記憶體使用狀況</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300">用戶資料</span>
                    <span className="text-white">{systemStats?.memoryUsage.users || 0} KB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300">任務資料</span>
                    <span className="text-white">{systemStats?.memoryUsage.tasks || 0} KB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300">總計</span>
                    <span className="text-white font-semibold">{systemStats?.memoryUsage.total || 0} KB</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <User size={20} />
                  <span>在線用戶列表</span>
                  <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/50">
                    {onlineUsers.length} 人在線
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {onlineUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Circle 
                            size={8} 
                            className={`fill-current ${getStatusColor(user.lastActive)}`} 
                          />
                          <div>
                            <p className="text-white font-medium">{user.name}</p>
                            <p className="text-xs text-purple-300">ID: {user.id.slice(-8)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-purple-300">
                            <Clock size={12} className="inline mr-1" />
                            {formatTimeAgo(user.lastActive)}
                          </p>
                          <p className="text-xs text-gray-400">
                            Session: {user.sessionToken}
                          </p>
                        </div>
                      </div>
                    ))}
                    {onlineUsers.length === 0 && (
                      <div className="text-center py-8 text-purple-300">
                        <User size={48} className="mx-auto mb-2 opacity-50" />
                        <p>目前沒有用戶在線</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors" className="space-y-4">
            <Card className="bg-black/40 backdrop-blur-sm border-red-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <AlertTriangle size={20} />
                  <span>系統錯誤日誌</span>
                  <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/50">
                    {errorLogs.length} 個錯誤
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {errorLogs.slice().reverse().map((log) => (
                      <div key={log.id} className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/50">
                            {log.context}
                          </Badge>
                          <span className="text-xs text-red-300">
                            {formatTimeAgo(log.timestamp)}
                          </span>
                        </div>
                        <p className="text-red-200 text-sm font-mono break-all">
                          {log.error}
                        </p>
                      </div>
                    ))}
                    {errorLogs.length === 0 && (
                      <div className="text-center py-8 text-purple-300">
                        <AlertTriangle size={48} className="mx-auto mb-2 opacity-50" />
                        <p>沒有錯誤記錄</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}