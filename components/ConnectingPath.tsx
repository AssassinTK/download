import React from 'react';

interface ConnectingPathProps {
  fromPosition: { x: number; y: number };
  toPosition: { x: number; y: number };
  isCompleted: boolean;
  direction: 'left' | 'right';
}

export function ConnectingPath({ fromPosition, toPosition, isCompleted, direction }: ConnectingPathProps) {
  const pathColor = isCompleted ? '#10B981' : '#D1D5DB';
  const pathWidth = isCompleted ? 4 : 3;
  
  // Create a curved path that winds left and right
  const midY = (fromPosition.y + toPosition.y) / 2;
  const controlPointOffset = direction === 'left' ? -40 : 40;
  
  const pathD = `M ${fromPosition.x} ${fromPosition.y} 
                 Q ${fromPosition.x + controlPointOffset} ${midY} 
                 ${toPosition.x} ${toPosition.y}`;

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {/* Main path */}
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        fill="none"
        strokeLinecap="round"
        className="transition-all duration-500 ease-in-out"
      />
      
      {/* Dotted overlay for incomplete paths */}
      {!isCompleted && (
        <path
          d={pathD}
          stroke="#9CA3AF"
          strokeWidth={2}
          fill="none"
          strokeDasharray="5,5"
          strokeLinecap="round"
          className="opacity-50"
        />
      )}
      
      {/* Progress animation for active paths */}
      {isCompleted && (
        <path
          d={pathD}
          stroke="rgba(16, 185, 129, 0.3)"
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
          className="animate-pulse"
        />
      )}
    </svg>
  );
}