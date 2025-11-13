import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, BookOpen, Building2, Users, Check, ExternalLink } from 'lucide-react';
import { UserProfile } from './CharacterSetup';

interface NewbieTrainingProps {
  currentUser: UserProfile;
  onBack: () => void;
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  items: {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    sopLink?: string;
    additionalInfo?: string[];
  }[];
}

const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'company-intro',
    title: '公司簡介',
    description: '了解企業文化與發展歷程',
    icon: <Building2 size={24} />,
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    items: [
      {
        id: 'culture',
        title: '企業文化',
        description: '了解公司歷史、願景與價值觀',
        isCompleted: false,
        sopLink: '/sop/company-culture.pdf',
        additionalInfo: ['公司歷史', '企業願景', '核心價值', '發展目標']
      },
      {
        id: 'organization',
        title: '組織架構',
        description: '認識各部門職能與協作關係',
        isCompleted: false,
        sopLink: '/sop/organization-structure.pdf',
        additionalInfo: ['部門介紹', '職責分工', '報告體系', '溝通流程']
      }
    ]
  },
  {
    id: 'workplace',
    title: '工作環境',
    description: '熟悉工作場所與安全規範',
    icon: <Users size={24} />,
    color: 'bg-gradient-to-br from-green-500 to-green-600',
    items: [
      {
        id: 'environment',
        title: '環境介紹',
        description: '熟悉工作場所與設施',
        isCompleted: false,
        sopLink: '/sop/workplace-intro.pdf',
        additionalInfo: ['場地配置', '安全設施', '緊急出口', '重要設備']
      },
      {
        id: 'safety',
        title: '安全須知',
        description: '工作安全與緊急應變',
        isCompleted: false,
        sopLink: '/sop/safety-guidelines.pdf',
        additionalInfo: ['安全規範', '防護用具', '事故處理', '急救常識']
      }
    ]
  },
  {
    id: 'basic-training',
    title: '基礎培訓',
    description: '工作基本技能與流程',
    icon: <BookOpen size={24} />,
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    items: [
      {
        id: 'work-basics',
        title: '工作基礎',
        description: '基本工作流程與要求',
        isCompleted: false,
        sopLink: '/sop/work-basics.pdf',
        additionalInfo: ['工作標準', '品質要求', '時間管理', '效率提升']
      },
      {
        id: 'communication',
        title: '溝通技巧',    
        description: '團隊協作與溝通方式',
        isCompleted: false,
        sopLink: '/sop/communication-skills.pdf',
        additionalInfo: ['內部溝通', '客戶服務', '問題反映', '團隊合作']
      }
    ]
  }
];

export function NewbieTraining({ currentUser, onBack }: NewbieTrainingProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const handleModuleClick = (moduleId: string) => {
    setSelectedModule(moduleId);
  };

  const handleBackToModules = () => {
    setSelectedModule(null);
  };

  const selectedModuleData = TRAINING_MODULES.find(m => m.id === selectedModule);

  if (selectedModule && selectedModuleData) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 p-4 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToModules}
              className="flex items-center space-x-1"
            >
              <ArrowLeft size={16} />
              <span>返回培訓選單</span>
            </Button>
            {selectedModuleData.icon}
            <div>
              <h1 className="text-xl font-semibold text-gray-800">{selectedModuleData.title}</h1>
              <p className="text-sm text-gray-600">{selectedModuleData.description}</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {selectedModuleData.items.map((item) => (
            <Card key={item.id} className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>{item.title}</span>
                      {item.isCompleted && (
                        <Badge className="bg-green-500">
                          <Check size={12} className="mr-1" />
                          已完成
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-gray-600 mt-2">{item.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {item.additionalInfo && (
                  <div>
                    <h5 className="font-medium mb-2">學習重點:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {item.additionalInfo.map((info, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full" />
                          <span>{info}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.sopLink && (
                  <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                    <ExternalLink size={16} className="text-blue-600" />
                    <a
                      href={item.sopLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      查看培訓資料
                    </a>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <Button
                    className="w-full"
                    disabled={item.isCompleted}
                  >
                    {item.isCompleted ? '已完成' : '開始學習'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
            <BookOpen className="text-blue-500" size={20} />
            <div>
              <h1 className="text-xl font-semibold text-gray-800">新手村</h1>
              <p className="text-sm text-gray-600">新人培訓與基礎介紹</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-1"
          >
            <ArrowLeft size={16} />
            <span>返回地圖</span>
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">🏠</div>
              <h2 className="text-2xl font-bold mb-2">歡迎來到新手村！</h2>
              <p className="text-gray-600">
                在開始正式工作前，讓我們先了解公司的基本資訊和工作環境。
                完成這些培訓將幫助您更快適應新的工作環境。
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRAINING_MODULES.map((module) => {
            const completedItems = module.items.filter(item => item.isCompleted).length;
            const totalItems = module.items.length;
            const progress = (completedItems / totalItems) * 100;

            return (
              <Card
                key={module.id}
                className="bg-white/70 backdrop-blur-sm cursor-pointer hover:scale-105 transition-all duration-300"
                onClick={() => handleModuleClick(module.id)}
              >
                <CardHeader>
                  <div className={`w-16 h-16 ${module.color} rounded-xl flex items-center justify-center text-white mb-4 mx-auto`}>
                    {module.icon}
                  </div>
                  <CardTitle className="text-center text-lg">{module.title}</CardTitle>
                  <p className="text-center text-sm text-gray-600">{module.description}</p>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{completedItems}/{totalItems} 已完成</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Badge variant="outline" className="w-full justify-center">
                    點擊開始學習
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}