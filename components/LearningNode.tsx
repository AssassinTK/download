import React from "react";
import { Badge } from "./ui/badge";
import { Star, Lock } from "lucide-react";

interface LearningNodeProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  isLocked: boolean;
  isActive: boolean;
  color: string;
  position: "left" | "right" | "center";
}

export function LearningNode({
  title,
  icon,
  isCompleted,
  isLocked,
  isActive,
  color,
  position,
}: LearningNodeProps) {
  const getNodeClasses = () => {
    let baseClasses =
      "relative flex flex-col items-center transition-all duration-300 ease-in-out";

    if (position === "left") {
      baseClasses += " items-start text-left";
    } else if (position === "right") {
      baseClasses += " items-end text-right";
    } else {
      baseClasses += " items-center text-center";
    }

    return baseClasses;
  };

  const getIconContainerClasses = () => {
    let classes =
      "w-16 h-16 rounded-full flex items-center justify-center relative transform transition-all duration-300 shadow-lg cursor-pointer";

    if (isCompleted) {
      classes += ` ${color} scale-110 shadow-xl`;
    } else if (isActive) {
      classes += ` ${color} scale-105 animate-pulse`;
    } else if (isLocked) {
      classes += " bg-gray-200 grayscale cursor-not-allowed";
    } else {
      classes += ` ${color} opacity-75 hover:scale-105 hover:opacity-100`;
    }

    return classes;
  };

  return (
    <div className={getNodeClasses()}>
      <div className={getIconContainerClasses()}>
        <div className="text-white text-xl">
          {isLocked ? <Lock size={24} /> : icon}
        </div>

        {/* Completion star */}
        {isCompleted && (
          <div className="absolute -top-1 -right-1">
            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <Star
                size={14}
                className="text-yellow-600 fill-current"
              />
            </div>
          </div>
        )}

        {/* Active indicator */}
        {isActive && !isCompleted && (
          <div className="absolute -top-1 -right-1">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="mt-3 max-w-24">
        <p
          className={`text-sm font-medium text-center leading-tight ${
            isLocked
              ? "text-gray-400"
              : isCompleted
                ? "text-gray-700"
                : "text-gray-600"
          }`}
        >
          {title}
        </p>
      </div>

      {/* Level badge for completed nodes */}
      {isCompleted && (
        <Badge className="mt-1 text-xs bg-green-100 text-green-700 hover:bg-green-100">
          完成
        </Badge>
      )}
    </div>
  );
}