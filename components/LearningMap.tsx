import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { LearningNode } from './LearningNode';
import { ConnectingPath } from './ConnectingPath';
import { SkillIndicator } from './SkillIndicator';
import { PeopleDirectory } from './PeopleDirectory';
import { EnvironmentContent } from './EnvironmentContent';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { Trophy, Star, ArrowLeft, Play, Edit, Settings, Save, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { UserProfile } from './CharacterSetup';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import {
  Book,
  Heart,
  Building2,
  Gift,
  Users,
  ChefHat,
  UserCheck
} from 'lucide-react';


interface SkillSet {
  speed: number;      // 速度
  accuracy: number;   // 準確度
  teamwork: number;   // 團隊合作
  communication: number; // 溝通
  quality: number;    // 品質
}

interface SubTask {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  skills?: SkillSet;
  sopLink?: string;
  clockInfo?: {
    location: string;
    workTime: string;
    breakTime: string;
  };
  additionalInfo?: string[];
}

interface LearningCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  isLocked: boolean;
  color: string;
  subTasks: SubTask[];
}

const getTrainingCategories = (selectedPath: 'indoor' | 'outdoor' | 'newbie' | 'tasks' | null): LearningCategory[] => {
  const outdoorCategories: LearningCategory[] = [
    {
      id: '1',
      title: '新人培訓',
      icon: <Users size={24} />,
      isCompleted: false,
      isLocked: false,
      color: 'bg-gradient-to-br from-blue-400 to-blue-500',
      subTasks: [
        { 
          id: '1-1', 
          title: '基礎服務', 
          description: '學習基本服務技巧與禮儀', 
          isCompleted: false,
          sopLink: '/sop/basic-service.pdf',
          clockInfo: { location: '員工休息室', workTime: '09:00-18:00', breakTime: '12:00-13:00' },
          additionalInfo: ['服務禮儀標準', '客戶溝通技巧', '基本餐具知識']
        },
        { 
          id: '1-2', 
          title: '產品知識', 
          description: '熟悉餐點與飲品內容', 
          isCompleted: false,
          sopLink: '/sop/product-knowledge.pdf',
          additionalInfo: ['菜單介紹', '過敏原資訊', '推薦搭配']
        },
        { 
          id: '1-3', 
          title: '收銀系統', 
          description: '掌握POS系統操作', 
          isCompleted: false,
          sopLink: '/sop/pos-system.pdf',
          additionalInfo: ['POS操作流程', '付款方式', '發票處理']
        }
      ]
    },
    {
      id: '2',
      title: '跑菜',
      icon: <Users size={24} />,
      isCompleted: false,
      isLocked: true,
      color: 'bg-gradient-to-br from-orange-400 to-orange-500',
      subTasks: [
        { 
          id: '2-1', 
          title: '跑菜基礎', 
          description: '學習餐點配送與桌面服務', 
          isCompleted: false,
          skills: { speed: 0, accuracy: 0, teamwork: 0, communication: 0, quality: 0 },
          sopLink: '/sop/food-runner-basic.pdf',
          clockInfo: { location: '廚房門口', workTime: '11:00-22:00', breakTime: '15:00-16:00' },
          additionalInfo: ['餐點識別', '配送順序', '桌面整理', '客戶確認']
        },
        { 
          id: '2-2', 
          title: '跑菜進階', 
          description: '複雜訂單處理與客戶溝通', 
          isCompleted: false,
          skills: { speed: 0, accuracy: 0, teamwork: 0, communication: 0, quality: 0 },
          sopLink: '/sop/food-runner-advanced.pdf',
          additionalInfo: ['多桌配送', '特殊需求處理', '問題解決', '團隊協作']
        }
      ]
    },
    {
      id: '3',
      title: '顧區',
      icon: <UserCheck size={24} />,
      isCompleted: false,
      isLocked: true,
      color: 'bg-gradient-to-br from-teal-400 to-teal-500',
      subTasks: [
        { 
          id: '3-1', 
          title: '顧區管理', 
          description: '負責特定區域的顧客服務', 
          isCompleted: false,
          skills: { speed: 0, accuracy: 0, teamwork: 0, communication: 0, quality: 0 },
          sopLink: '/sop/area-management.pdf',
          clockInfo: { location: '服務台', workTime: '10:30-21:30', breakTime: '14:30-15:30' },
          additionalInfo: ['區域責任制', '桌面管理', '客戶接待', '清潔維護']
        },
        { 
          id: '3-2', 
          title: '客戶關係', 
          description: '建立良好客戶關係與處理投訴', 
          isCompleted: false,
          skills: { speed: 0, accuracy: 0, teamwork: 0, communication: 0, quality: 0 },
          sopLink: '/sop/customer-relations.pdf',
          additionalInfo: ['客戶溝通技巧', '投訴處理流程', '滿意度提升', '回客經營']
        }
      ]
    },
    {
      id: '4',
      title: '吧檯',
      icon: <Gift size={24} />,
      isCompleted: false,
      isLocked: true,
      color: 'bg-gradient-to-br from-purple-400 to-purple-500',
      subTasks: [
        { 
          id: '4-1', 
          title: '飲品製作', 
          description: '飲品製作與吧檯管理', 
          isCompleted: false,
          skills: { speed: 0, accuracy: 0, teamwork: 0, communication: 0, quality: 0 },
          sopLink: '/sop/beverage-making.pdf',
          clockInfo: { location: '吧檯區', workTime: '09:30-22:00', breakTime: '16:00-17:00' },
          additionalInfo: ['咖啡製作', '茶類調製', '特調飲品', '溫度控制']
        },
        { 
          id: '4-2', 
          title: '設備維護', 
          description: '吧檯設備清潔與維護', 
          isCompleted: false,
          skills: { speed: 0, accuracy: 0, teamwork: 0, communication: 0, quality: 0 },
          sopLink: '/sop/equipment-maintenance.pdf',
          additionalInfo: ['咖啡機清潔', '設備檢查', '庫存管理', '衛生標準']
        }
      ]
    },
    {
      id: '5',
      title: 'Duty',
      icon: <Trophy size={24} />,
      isCompleted: false,
      isLocked: true,
      color: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
      subTasks: [
        { 
          id: '5-1', 
          title: '當班管理', 
          description: '當班管理與協調工作', 
          isCompleted: false,
          skills: { speed: 0, accuracy: 0, teamwork: 0, communication: 0, quality: 0 },
          sopLink: '/sop/shift-management.pdf',
          clockInfo: { location: '管理辦公室', workTime: '08:00-20:00', breakTime: '自行安排' },
          additionalInfo: ['人員調度', '業績監控', '品質管控', '異常處理']
        },
        { 
          id: '5-2', 
          title: '團隊領導', 
          description: '領導團隊與問題解決', 
          isCompleted: false,
          skills: { speed: 0, accuracy: 0, teamwork: 0, communication: 0, quality: 0 },
          sopLink: '/sop/team-leadership.pdf',
          additionalInfo: ['團隊激勵', '衝突處理', '培訓指導', '績效評估']
        }
      ]
    }
  ];

  const indoorCategories: LearningCategory[] = [
    {
      id: '1',
      title: '新人培訓',
      icon: <ChefHat size={24} />,
      isCompleted: false,
      isLocked: false,
      color: 'bg-gradient-to-br from-blue-400 to-blue-500',
      subTasks: [
        { 
          id: '1-1', 
          title: '廚房安全', 
          description: '學習廚房安全規範與衛生標準', 
          isCompleted: false,
          sopLink: '/sop/kitchen-safety.pdf',
          clockInfo: { location: '廚房入口', workTime: '10:00-22:00', breakTime: '15:00-16:00' },
          additionalInfo: ['HACCP標準', '刀具安全', '燙傷防護', '清潔消毒']
        },
        { 
          id: '1-2', 
          title: '設備認識', 
          description: '熟悉各種廚房設備使用方法', 
          isCompleted: false,
          sopLink: '/sop/equipment-training.pdf',
          additionalInfo: ['爐台操作', '烤箱使用', '冷藏設備', '清洗設備']
        },
        { 
          id: '1-3', 
          title: '食材處理', 
          description: '掌握基本食材處理技巧', 
          isCompleted: false,
          sopLink: '/sop/ingredient-handling.pdf',
          additionalInfo: ['食材保存', '切配技巧', '品質檢查', '庫存管理']
        }
      ]
    },
    {
      id: '2',
      title: '炸台',
      icon: <ChefHat size={24} />,
      isCompleted: false,
      isLocked: true,
      color: 'bg-gradient-to-br from-red-400 to-red-500',
      subTasks: [
        { 
          id: '2-1', 
          title: '炸台基礎', 
          description: '油炸食品製作與品質控制', 
          isCompleted: false,
          skills: { speed: 0, accuracy: 0, teamwork: 0, communication: 0, quality: 0 },
          sopLink: '/sop/fry-station-basic.pdf',
          clockInfo: { location: '炸台區', workTime: '11:00-23:00', breakTime: '16:00-17:00' },
          additionalInfo: ['油溫控制', '炸物標準', '時間掌控', '出餐品質']
        },
        { 
          id: '2-2', 
          title: '炸台進階', 
          description: '複雜炸物製作與溫度控制', 
          isCompleted: false,
          skills: { speed: 0, accuracy: 0, teamwork: 0, communication: 0, quality: 0 },
          sopLink: '/sop/fry-station-advanced.pdf',
          additionalInfo: ['多品項管理', '炸油管理', '效率提升', '品質穩定']
        }
      ]
    },
    {
      id: '3',
      title: '沙拉',
      icon: <Building2 size={24} />,
      isCompleted: false,
      isLocked: true,
      color: 'bg-gradient-to-br from-green-400 to-green-500',
      subTasks: [
        { 
          id: '3-1', 
          title: '沙拉製作', 
          description: '沙拉與冷食製作', 
          isCompleted: false,
          skills: { speed: 0, accuracy: 0, teamwork: 0, communication: 0, quality: 0 },
          sopLink: '/sop/salad-making.pdf',
          clockInfo: { location: '沙拉台', workTime: '10:30-22:30', breakTime: '15:30-16:30' },
          additionalInfo: ['蔬菜處理', '醬料搭配', '分量控制', '保鮮技巧']
        },
        { 
          id: '3-2', 
          title: '擺盤藝術', 
          description: '沙拉擺盤與視覺呈現', 
          isCompleted: false,
          skills: { speed: 0, accuracy: 0, teamwork: 0, communication: 0, quality: 0 },
          sopLink: '/sop/plating-art.pdf',
          additionalInfo: ['色彩搭配', '層次設計', '視覺美感', '創意發想']
        }
      ]
    },
    {
      id: '4',
      title: '爐台',
      icon: <Heart size={24} />,
      isCompleted: false,
      isLocked: true,
      color: 'bg-gradient-to-br from-pink-400 to-pink-500',
      subTasks: [
        { 
          id: '4-1', 
          title: '爐台操作', 
          description: '熱炒與煎煮食品製作', 
          isCompleted: false,
          skills: { speed: 0, accuracy: 0, teamwork: 0, communication: 0, quality: 0 },
          sopLink: '/sop/stove-operation.pdf',
          clockInfo: { location: '爐台區', workTime: '11:30-23:30', breakTime: '16:30-17:30' },
          additionalInfo: ['火候掌控', '調味技巧', '時間管理', '出餐節奏']
        },
        { 
          id: '4-2', 
          title: '火候控制', 
          description: '掌握不同菜品的火候與調味', 
          isCompleted: false,
          skills: { speed: 0, accuracy: 0, teamwork: 0, communication: 0, quality: 0 },
          sopLink: '/sop/heat-control.pdf',
          additionalInfo: ['溫度掌握', '口味調整', '質地控制', '營養保持']
        }
      ]
    },
    {
      id: '5',
      title: 'PIZZA',
      icon: <Star size={24} />,
      isCompleted: false,
      isLocked: true,
      color: 'bg-gradient-to-br from-purple-400 to-purple-500',
      subTasks: [
        { 
          id: '5-1', 
          title: 'PIZZA製作', 
          description: '披薩製作與烘烤技術', 
          isCompleted: false,
          skills: { speed: 0, accuracy: 0, teamwork: 0, communication: 0, quality: 0 },
          sopLink: '/sop/pizza-making.pdf',
          clockInfo: { location: 'PIZZA台', workTime: '11:00-00:00', breakTime: '17:00-18:00' },
          additionalInfo: ['麵團製作', '餡料搭配', '烘烤技術', '成品檢查']
        },
        { 
          id: '5-2', 
          title: '創意PIZZA', 
          description: '特色披薩開發與品質提升', 
          isCompleted: false,
          skills: { speed: 0, accuracy: 0, teamwork: 0, communication: 0, quality: 0 },
          sopLink: '/sop/creative-pizza.pdf',
          additionalInfo: ['新品開發', '口味創新', '成本控制', '客戶回饋']
        }
      ]
    },
    {
      id: '6',
      title: 'Duty',
      icon: <Trophy size={24} />,
      isCompleted: false,
      isLocked: true,
      color: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
      subTasks: [
        { 
          id: '6-1', 
          title: '廚房管理', 
          description: '廚房管理與品質監控', 
          isCompleted: false,
          skills: { speed: 0, accuracy: 0, teamwork: 0, communication: 0, quality: 0 },
          sopLink: '/sop/kitchen-management.pdf',
          clockInfo: { location: '廚房總控', workTime: '09:00-24:00', breakTime: '自行安排' },
          additionalInfo: ['生產調度', '品質監控', '成本控制', '安全管理']
        },
        { 
          id: '6-2', 
          title: '團隊協調', 
          description: '廚房團隊協調與效率提升', 
          isCompleted: false,
          skills: { speed: 0, accuracy: 0, teamwork: 0, communication: 0, quality: 0 },
          sopLink: '/sop/team-coordination.pdf',
          additionalInfo: ['人員配置', '流程優化', '溝通協調', '績效管理']
        }
      ]
    }
  ];

  const newbieCategories: LearningCategory[] = [
    {
      id: 'newbie-1',
      title: '公司簡介',
      icon: <Building2 size={24} />,
      isCompleted: false,
      isLocked: false,
      color: 'bg-gradient-to-br from-blue-400 to-blue-500',
      subTasks: [
        { 
          id: 'newbie-1-1', 
          title: '企業文化', 
          description: '了解公司歷史、願景與價值觀', 
          isCompleted: false,
          sopLink: '/sop/company-culture.pdf',
          additionalInfo: ['公司歷史', '企業願景', '核心價值', '發展目標']
        },
        { 
          id: 'newbie-1-2', 
          title: '組織架構', 
          description: '認識各部門職能與協作關係', 
          isCompleted: false,
          sopLink: '/sop/organization-structure.pdf',
          additionalInfo: ['部門介紹', '職責分工', '報告體系', '溝通流程']
        }
      ]
    },
    {
      id: 'newbie-2',
      title: '工作環境',
      icon: <Users size={24} />,
      isCompleted: false,
      isLocked: true,
      color: 'bg-gradient-to-br from-green-400 to-green-500',
      subTasks: [
        { 
          id: 'newbie-2-1', 
          title: '環境介紹', 
          description: '熟悉工作場所與設施', 
          isCompleted: false,
          sopLink: '/sop/workplace-intro.pdf',
          additionalInfo: ['場地配置', '安全設施', '緊急出口', '重要設備']
        },
        { 
          id: 'newbie-2-2', 
          title: '安全須知', 
          description: '工作安全與緊急應變', 
          isCompleted: false,
          sopLink: '/sop/safety-guidelines.pdf',
          additionalInfo: ['安全規範', '防護用具', '事故處理', '急救常識']
        }
      ]
    }
  ];

  const taskCategories: LearningCategory[] = [
    {
      id: 'task-1',
      title: '每日任務',
      icon: <UserCheck size={24} />,
      isCompleted: false,
      isLocked: false,
      color: 'bg-gradient-to-br from-purple-400 to-purple-500',
      subTasks: [
        { 
          id: 'task-1-1', 
          title: '打卡簽到', 
          description: '完成每日打卡與簽到流程', 
          isCompleted: false,
          sopLink: '/sop/daily-checkin.pdf',
          clockInfo: { location: '入口處', workTime: '依班表', breakTime: '依班表' },
          additionalInfo: ['打卡機使用', '異常處理', '請假流程', '加班申請']
        },
        { 
          id: 'task-1-2', 
          title: '工作準備', 
          description: '每日工作前準備檢查', 
          isCompleted: false,
          sopLink: '/sop/work-preparation.pdf',
          additionalInfo: ['個人清潔', '制服穿著', '工具檢查', '環境整理']
        }
      ]
    },
    {
      id: 'task-2',
      title: '週期任務',
      icon: <Trophy size={24} />,
      isCompleted: false,
      isLocked: true,
      color: 'bg-gradient-to-br from-orange-400 to-orange-500',
      subTasks: [
        { 
          id: 'task-2-1', 
          title: '培訓考核', 
          description: '定期技能評估與認證', 
          isCompleted: false,
          sopLink: '/sop/skill-assessment.pdf',
          additionalInfo: ['評估標準', '考核流程', '認證要求', '改善建議']
        },
        { 
          id: 'task-2-2', 
          title: '績效回顧', 
          description: '工作表現檢討與改進', 
          isCompleted: false,
          sopLink: '/sop/performance-review.pdf',
          additionalInfo: ['表現評估', '目標設定', '發展計畫', '獎勵機制']
        }
      ]
    }
  ];

  return selectedPath === 'outdoor' ? outdoorCategories : 
         selectedPath === 'indoor' ? indoorCategories : 
         selectedPath === 'newbie' ? newbieCategories :
         selectedPath === 'tasks' ? taskCategories :
         [];
};

interface LearningMapProps {
  currentUser: UserProfile;
  isAdmin: boolean;
  selectedPath: 'indoor' | 'outdoor' | 'newbie' | 'tasks' | null;
  onBack?: () => void;
}

export function LearningMap({ currentUser, isAdmin, selectedPath, onBack }: LearningMapProps) {
  const [nodePositions, setNodePositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<LearningCategory[]>(() => getTrainingCategories(selectedPath));
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSubTask, setEditingSubTask] = useState<{categoryId: string, subTaskId: string} | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const completedCategories = React.useMemo(() => 
    categories.filter(category => category.isCompleted).length, 
    [categories]
  );
  const totalCategories = categories.length;
  const progressPercentage = (completedCategories / totalCategories) * 100;

  const activeCategory = React.useMemo(() => 
    categories.find(category => !category.isCompleted && !category.isLocked), 
    [categories]
  );

  const handleCategoryClick = React.useCallback((categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category && !category.isLocked) {
      setSelectedCategory(categoryId);
    }
  }, [categories]);

  const handleBackToMap = React.useCallback(() => {
    setSelectedCategory(null);
  }, []);

  const handleEditSubTask = React.useCallback((categoryId: string, subTaskId: string, updatedSubTask: SubTask) => {
    setCategories(prevCategories => {
      const newCategories = [...prevCategories];
      const categoryIndex = newCategories.findIndex(c => c.id === categoryId);
      
      if (categoryIndex === -1) return prevCategories;
      
      const category = { ...newCategories[categoryIndex] };
      const subTaskIndex = category.subTasks.findIndex(t => t.id === subTaskId);
      
      if (subTaskIndex === -1) return prevCategories;
      
      // Create new category and subtasks array
      category.subTasks = [...category.subTasks];
      category.subTasks[subTaskIndex] = updatedSubTask;
      newCategories[categoryIndex] = category;
      
      // Save to backend (async)
      const saveData = async () => {
        try {
          await fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/admin/training-content/${categoryId}/subtask/${subTaskId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ subTask: updatedSubTask })
          });
          toast.success('內容更新成功');
        } catch (error) {
          console.error('Failed to save subtask:', error);
          toast.error('保存失敗');
        }
      };
      saveData();
      
      return newCategories;
    });
    
    setEditingSubTask(null);
  }, []);

  const handleSubTaskClick = React.useCallback((categoryId: string, subTaskId: string) => {
    setCategories(prevCategories => {
      const newCategories = [...prevCategories];
      const categoryIndex = newCategories.findIndex(c => c.id === categoryId);
      
      if (categoryIndex === -1) return prevCategories;
      
      const category = newCategories[categoryIndex];
      const subTaskIndex = category.subTasks.findIndex(t => t.id === subTaskId);
      
      if (subTaskIndex === -1 || category.subTasks[subTaskIndex].isCompleted) {
        return prevCategories;
      }
      
      // Create new category object
      const updatedCategory = { ...category };
      updatedCategory.subTasks = [...category.subTasks];
      
      // Update the specific subtask
      const subTask = updatedCategory.subTasks[subTaskIndex];
      const skillIncrease = {
        speed: Math.floor(Math.random() * 20) + 10,
        accuracy: Math.floor(Math.random() * 20) + 10,
        teamwork: Math.floor(Math.random() * 20) + 10,
        communication: Math.floor(Math.random() * 20) + 10,
        quality: Math.floor(Math.random() * 20) + 10
      };
      
      updatedCategory.subTasks[subTaskIndex] = {
        ...subTask,
        isCompleted: true,
        skills: subTask.skills ? {
          speed: Math.min(100, subTask.skills.speed + skillIncrease.speed),
          accuracy: Math.min(100, subTask.skills.accuracy + skillIncrease.accuracy),
          teamwork: Math.min(100, subTask.skills.teamwork + skillIncrease.teamwork),
          communication: Math.min(100, subTask.skills.communication + skillIncrease.communication),
          quality: Math.min(100, subTask.skills.quality + skillIncrease.quality)
        } : subTask.skills
      };
      
      // Check if category should be marked as completed
      const allSubTasksCompleted = updatedCategory.subTasks.every(task => task.isCompleted);
      updatedCategory.isCompleted = allSubTasksCompleted;
      
      // Update the category in the array
      newCategories[categoryIndex] = updatedCategory;
      
      // Unlock next category if current one is completed
      if (allSubTasksCompleted && categoryIndex + 1 < newCategories.length && newCategories[categoryIndex + 1].isLocked) {
        newCategories[categoryIndex + 1] = {
          ...newCategories[categoryIndex + 1],
          isLocked: false
        };
      }

      // Sync progress to backend
      const completedCount = newCategories.filter(cat => cat.isCompleted).length;
      const progressPercentage = Math.round((completedCount / newCategories.length) * 100);
      
      // Send update to server (async, don't wait for response)
      fetch(`https://${(globalThis as any).SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-23e1100b/users/${currentUser.id}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(globalThis as any).SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          progress: {
            completedCategories: completedCount,
            totalCategories: newCategories.length,
            percentage: progressPercentage
          },
          categories: {
            [categoryId]: {
              isCompleted: updatedCategory.isCompleted,
              subTasks: updatedCategory.subTasks.map(task => ({
                id: task.id,
                isCompleted: task.isCompleted,
                skills: task.skills
              }))
            }
          }
        })
      }).catch(error => {
        console.error('Failed to sync progress:', error);
      });
      
      return newCategories;
    });
  }, [currentUser.id]);

  useEffect(() => {
    // Calculate positions for nodes in a winding path
    const positions: { [key: string]: { x: number; y: number } } = {};
    
    categories.forEach((category, index) => {
      const isEven = index % 2 === 0;
      const yPosition = 120 + (index * 140);
      const xPosition = isEven ? 100 : 250; // Alternate between left and right
      
      positions[category.id] = { x: xPosition, y: yPosition };
    });
    
    setNodePositions(positions);
  }, [categories]);

  const getNodePosition = (index: number): 'left' | 'right' | 'center' => {
    return index % 2 === 0 ? 'left' : 'right';
  };

  const selectedCategoryData = React.useMemo(() => 
    selectedCategory ? categories.find(c => c.id === selectedCategory) : null,
    [selectedCategory, categories]
  );



  // Render sub-tasks view
  if (selectedCategory && selectedCategoryData) {
    const completedSubTasks = selectedCategoryData.subTasks.filter(task => task.isCompleted).length;
    const totalSubTasks = selectedCategoryData.subTasks.length;
    const subProgressPercentage = (completedSubTasks / totalSubTasks) * 100;

    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900">
        {/* Sub-tasks Header */}
        <div className="bg-gradient-to-r from-slate-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-sm border-b border-yellow-400/30 p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToMap}
                className="flex items-center space-x-1 text-yellow-400 hover:text-yellow-300"
              >
                <ArrowLeft size={16} />
                <span>返回</span>
              </Button>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedCategoryData.color}`}>
              <div className="text-white text-sm">
                {selectedCategoryData.icon}
              </div>
            </div>
              <div>
                <h1 className="text-xl font-semibold text-yellow-400">{selectedCategoryData.title}</h1>
                <p className="text-sm text-gray-300">完成所有學習項目</p>
              </div>
            </div>
            
            {/* Admin Edit Button */}
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditMode(!isEditMode)}
                className="flex items-center space-x-1 bg-slate-800/70 backdrop-blur-sm text-yellow-400 border-yellow-400/30 hover:bg-slate-700/90"
              >
                <Edit size={14} />
                <span>{isEditMode ? '完成編輯' : '編輯內容'}</span>
              </Button>
            )}
          </div>
          
          {/* Sub Progress bar */}
          <div className="mt-3">
            <Progress value={subProgressPercentage} className="h-2" />
            <p className="text-xs text-gray-400 mt-1">{completedSubTasks}/{totalSubTasks} 項目完成 ({Math.round(subProgressPercentage)}%)</p>
          </div>
        </div>

        {/* Sub-tasks List */}
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-4 space-y-4">
            {selectedCategoryData.subTasks.map((subTask, index) => (
              <div
                key={subTask.id}
                className={`bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 ${
                  subTask.isCompleted 
                    ? 'border-green-400/50 bg-green-900/30' 
                    : 'border-gray-600/50 hover:border-yellow-400/50 hover:shadow-lg cursor-pointer'
                }`}
                onClick={() => !subTask.isCompleted && handleSubTaskClick(selectedCategory!, subTask.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    subTask.isCompleted ? 'bg-green-500' : 'bg-yellow-500 hover:bg-yellow-400'
                  }`}>
                    {subTask.isCompleted ? (
                      <Star size={16} className="text-white fill-current" />
                    ) : (
                      <Play size={14} className="text-black" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {editingSubTask?.categoryId === selectedCategory && editingSubTask?.subTaskId === subTask.id ? (
                          // Edit mode
                          <div className="space-y-3">
                            <div>
                              <Input
                                value={subTask.title}
                                onChange={(e) => {
                                  setCategories(prev => {
                                    const newCategories = [...prev];
                                    const catIndex = newCategories.findIndex(c => c.id === selectedCategory);
                                    if (catIndex !== -1) {
                                      const subIndex = newCategories[catIndex].subTasks.findIndex(t => t.id === subTask.id);
                                      if (subIndex !== -1) {
                                        newCategories[catIndex] = { ...newCategories[catIndex] };
                                        newCategories[catIndex].subTasks = [...newCategories[catIndex].subTasks];
                                        newCategories[catIndex].subTasks[subIndex] = { 
                                          ...newCategories[catIndex].subTasks[subIndex], 
                                          title: e.target.value 
                                        };
                                      }
                                    }
                                    return newCategories;
                                  });
                                }}
                                className="bg-slate-700 text-white border-slate-600"
                                placeholder="標題"
                              />
                            </div>
                            <div>
                              <Textarea
                                value={subTask.description}
                                onChange={(e) => {
                                  setCategories(prev => {
                                    const newCategories = [...prev];
                                    const catIndex = newCategories.findIndex(c => c.id === selectedCategory);
                                    if (catIndex !== -1) {
                                      const subIndex = newCategories[catIndex].subTasks.findIndex(t => t.id === subTask.id);
                                      if (subIndex !== -1) {
                                        newCategories[catIndex] = { ...newCategories[catIndex] };
                                        newCategories[catIndex].subTasks = [...newCategories[catIndex].subTasks];
                                        newCategories[catIndex].subTasks[subIndex] = { 
                                          ...newCategories[catIndex].subTasks[subIndex], 
                                          description: e.target.value 
                                        };
                                      }
                                    }
                                    return newCategories;
                                  });
                                }}
                                className="bg-slate-700 text-white border-slate-600"
                                placeholder="描述"
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  const currentSubTask = categories
                                    .find(c => c.id === selectedCategory)
                                    ?.subTasks.find(t => t.id === subTask.id);
                                  if (currentSubTask) {
                                    handleEditSubTask(selectedCategory!, subTask.id, currentSubTask);
                                  }
                                }}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Save size={14} className="mr-1" />
                                保存
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingSubTask(null)}
                                className="text-gray-300 border-gray-600"
                              >
                                <X size={14} className="mr-1" />
                                取消
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // View mode
                          <>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium text-white">{subTask.title}</h3>
                                <p className="text-sm text-gray-300 mt-1">{subTask.description}</p>
                              </div>
                              {isAdmin && isEditMode && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingSubTask({categoryId: selectedCategory!, subTaskId: subTask.id});
                                  }}
                                  className="text-yellow-400 hover:text-yellow-300 ml-2"
                                >
                                  <Edit size={14} />
                                </Button>
                              )}
                            </div>
                        
                        {/* SOP Link */}
                        {subTask.sopLink && (
                          <div className="mt-2">
                            <a 
                              href={subTask.sopLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-400 hover:text-blue-300 underline"
                            >
                              📋 SOP操作手冊
                            </a>
                          </div>
                        )}

                        {/* Clock Info */}
                        {subTask.clockInfo && (
                          <div className="mt-2 p-2 bg-slate-900/50 rounded text-xs text-gray-400">
                            <div className="grid grid-cols-1 gap-1">
                              <div>📍 打卡位置: {subTask.clockInfo.location}</div>
                              <div>⏰ 工作時間: {subTask.clockInfo.workTime}</div>
                              <div>☕ 休息時間: {subTask.clockInfo.breakTime}</div>
                            </div>
                          </div>
                        )}

                        {/* Additional Info */}
                        {subTask.additionalInfo && subTask.additionalInfo.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 mb-1">學習重點:</p>
                            <div className="flex flex-wrap gap-1">
                              {subTask.additionalInfo.map((info, idx) => (
                                <span key={idx} className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded">
                                  {info}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                            {!subTask.isCompleted && (
                              <p className="text-xs text-yellow-400 mt-2">點擊開始學習</p>
                            )}
                          </>
                        )}
                      </div>
                      {subTask.isCompleted && (
                        <div className="text-green-400 flex-shrink-0 ml-2">
                          <Star size={20} fill="currentColor" />
                        </div>
                      )}
                    </div>
                    
                    {/* Skill indicators for position-based tasks */}
                    {subTask.skills && subTask.isCompleted && (
                      <div className="mt-4 p-3 bg-slate-700/50 rounded-lg border border-gray-600/30">
                        <SkillIndicator skills={subTask.skills} />
                      </div>
                    )}
                    
                    {/* Placeholder for incomplete skill-based tasks */}
                    {subTask.skills && !subTask.isCompleted && (
                      <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-gray-700/30">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">待解鎖技能</h4>
                        <div className="grid grid-cols-5 gap-2">
                          {Object.keys(subTask.skills).map((skill) => (
                            <div key={skill} className="w-8 h-8 bg-gray-700 rounded-full opacity-50"></div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-sm border-b border-yellow-400/30 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-yellow-400">
              {selectedPath === 'outdoor' ? '外場修練道' : selectedPath === 'indoor' ? '內場修練道' : '培訓系統'}
            </h1>
            <p className="text-sm text-gray-300">完成所有類別以獲得認證</p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Admin controls */}
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="flex items-center space-x-1 bg-slate-800/70 backdrop-blur-sm text-yellow-400 border-yellow-400/30 hover:bg-slate-700/90"
                >
                  <Edit size={14} />
                  <span>{isEditMode ? '完成編輯' : '編輯內容'}</span>
                </Button>

              </>
            )}
            <Trophy className="text-yellow-500" size={20} />
            <span className="text-sm font-medium text-white">{completedCategories}/{totalCategories}</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3">
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-gray-400 mt-1">{Math.round(progressPercentage)}% 完成</p>
        </div>
      </div>

      {/* Learning Map */}
      <ScrollArea className="h-[calc(100vh-140px)]">
        <div 
          ref={containerRef}
          className="relative w-full min-h-full p-4"
          style={{ height: categories.length * 140 + 240 }}
        >
          {/* Connecting paths */}
          {categories.slice(0, -1).map((category, index) => {
            const currentPos = nodePositions[category.id];
            const nextPos = nodePositions[categories[index + 1].id];
            
            if (!currentPos || !nextPos) return null;
            
            return (
              <ConnectingPath
                key={`path-${category.id}`}
                fromPosition={{ x: currentPos.x, y: currentPos.y + 32 }}
                toPosition={{ x: nextPos.x, y: nextPos.y - 32 }}
                isCompleted={category.isCompleted}
                direction={index % 2 === 0 ? 'right' : 'left'}
              />
            );
          })}

          {/* Learning nodes */}
          {categories.map((category, index) => {
            const position = nodePositions[category.id];
            if (!position) return null;

            return (
              <div
                key={category.id}
                className="absolute cursor-pointer"
                style={{
                  left: position.x - 40,
                  top: position.y - 32,
                  zIndex: 2
                }}
                onClick={() => handleCategoryClick(category.id)}
              >
                <LearningNode
                  {...category}
                  isActive={activeCategory?.id === category.id}
                  position={getNodePosition(index)}
                />
              </div>
            );
          })}

          {/* Floating stars for decoration */}
          <div className="absolute top-10 left-10 text-yellow-300 opacity-60">
            <Star size={16} fill="currentColor" />
          </div>
          <div className="absolute top-32 right-16 text-pink-300 opacity-60">
            <Star size={12} fill="currentColor" />
          </div>
          <div className="absolute bottom-32 left-20 text-purple-300 opacity-60">
            <Star size={14} fill="currentColor" />
          </div>
          <div className="absolute bottom-10 right-10 text-blue-300 opacity-60">
            <Star size={18} fill="currentColor" />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}