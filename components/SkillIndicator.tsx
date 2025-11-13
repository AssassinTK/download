import React from 'react';
import { Progress } from './ui/progress';

interface SkillSet {
  speed: number;
  accuracy: number;
  teamwork: number;
  communication: number;
  quality: number;
}

interface SkillIndicatorProps {
  skills: SkillSet;
  className?: string;
}

const skillLabels = {
  speed: '速度',
  accuracy: '準確度', 
  teamwork: '團隊合作',
  communication: '溝通',
  quality: '品質'
};

const skillColors = {
  speed: 'bg-blue-500',
  accuracy: 'bg-green-500',
  teamwork: 'bg-purple-500',
  communication: 'bg-orange-500',
  quality: 'bg-red-500'
};

export function SkillIndicator({ skills, className = '' }: SkillIndicatorProps) {
  const skillEntries = React.useMemo(() => Object.entries(skills), [skills]);
  
  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700 mb-3">技能指數</h4>
      {skillEntries.map(([skillKey, value]) => (
        <div key={skillKey} className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">
              {skillLabels[skillKey as keyof SkillSet]}
            </span>
            <span className="text-xs font-medium text-gray-700">{value}/100</span>
          </div>
          <div className="relative bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${skillColors[skillKey as keyof SkillSet]}`}
              style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}