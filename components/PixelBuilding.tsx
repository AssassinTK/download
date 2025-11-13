import React from 'react';

interface PixelBuildingProps {
  type: 'house' | 'castle' | 'village' | 'plaza';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  className?: string;
}

export function PixelBuilding({ type, size = 'medium', onClick, className = '' }: PixelBuildingProps) {
  const getPixelArt = () => {
    const sizeMultiplier = size === 'small' ? 1 : size === 'medium' ? 1.5 : 2;
    const baseSize = 2;
    const pixelSize = baseSize * sizeMultiplier;

    switch (type) {
      case 'house':
        return (
          <div 
            className={`cursor-pointer transform hover:scale-110 transition-all duration-200 ${className}`}
            onClick={onClick}
            style={{ 
              width: `${32 * sizeMultiplier}px`, 
              height: `${32 * sizeMultiplier}px`,
              imageRendering: 'pixelated'
            }}
          >
            <svg 
              width={32 * sizeMultiplier} 
              height={32 * sizeMultiplier} 
              viewBox="0 0 32 32"
              style={{ imageRendering: 'pixelated' }}
            >
              {/* House base */}
              <rect x="6" y="16" width="20" height="14" fill="#8B4513" />
              {/* Roof */}
              <rect x="4" y="10" width="24" height="8" fill="#654321" />
              <rect x="6" y="8" width="20" height="4" fill="#4A2C17" />
              <rect x="8" y="6" width="16" height="4" fill="#3E2414" />
              <rect x="12" y="4" width="8" height="4" fill="#321D0F" />
              {/* Door */}
              <rect x="14" y="22" width="4" height="8" fill="#2D1810" />
              {/* Windows */}
              <rect x="9" y="19" width="3" height="3" fill="#FFD700" />
              <rect x="20" y="19" width="3" height="3" fill="#FFD700" />
              {/* Window frames */}
              <rect x="8" y="18" width="5" height="5" fill="#4A2C17" fillOpacity="0.3" />
              <rect x="19" y="18" width="5" height="5" fill="#4A2C17" fillOpacity="0.3" />
              {/* Chimney */}
              <rect x="20" y="6" width="4" height="6" fill="#8B4513" />
              {/* Smoke */}
              <rect x="21" y="2" width="2" height="4" fill="#E6E6E6" fillOpacity="0.7" />
            </svg>
          </div>
        );

      case 'castle':
        return (
          <div 
            className={`cursor-pointer transform hover:scale-105 transition-all duration-200 ${className}`}
            onClick={onClick}
            style={{ 
              width: `${48 * sizeMultiplier}px`, 
              height: `${48 * sizeMultiplier}px`,
              imageRendering: 'pixelated'
            }}
          >
            <svg 
              width={48 * sizeMultiplier} 
              height={48 * sizeMultiplier} 
              viewBox="0 0 48 48"
              style={{ imageRendering: 'pixelated' }}
            >
              {/* Castle base */}
              <rect x="4" y="20" width="40" height="26" fill="#696969" />
              {/* Towers */}
              <rect x="2" y="12" width="10" height="34" fill="#808080" />
              <rect x="36" y="12" width="10" height="34" fill="#808080" />
              <rect x="18" y="8" width="12" height="38" fill="#A9A9A9" />
              {/* Tower tops */}
              <rect x="0" y="10" width="14" height="4" fill="#4B0082" />
              <rect x="34" y="10" width="14" height="4" fill="#4B0082" />
              <rect x="16" y="6" width="16" height="4" fill="#6A0DAD" />
              {/* Flags */}
              <rect x="6" y="4" width="4" height="6" fill="#FFD700" />
              <rect x="38" y="4" width="4" height="6" fill="#FFD700" />
              <rect x="22" y="0" width="4" height="6" fill="#FF4500" />
              {/* Gate */}
              <rect x="20" y="30" width="8" height="16" fill="#2F4F4F" />
              <rect x="21" y="31" width="6" height="14" fill="#1C1C1C" />
              {/* Windows */}
              <rect x="6" y="18" width="2" height="3" fill="#FFD700" />
              <rect x="40" y="18" width="2" height="3" fill="#FFD700" />
              <rect x="22" y="14" width="4" height="4" fill="#FFD700" />
              {/* Battlements */}
              <rect x="2" y="10" width="2" height="4" fill="#696969" />
              <rect x="6" y="10" width="2" height="4" fill="#696969" />
              <rect x="10" y="10" width="2" height="4" fill="#696969" />
              <rect x="36" y="10" width="2" height="4" fill="#696969" />
              <rect x="40" y="10" width="2" height="4" fill="#696969" />
              <rect x="44" y="10" width="2" height="4" fill="#696969" />
            </svg>
          </div>
        );

      case 'village':
        return (
          <div 
            className={`cursor-pointer transform hover:scale-110 transition-all duration-200 ${className}`}
            onClick={onClick}
            style={{ 
              width: `${36 * sizeMultiplier}px`, 
              height: `${36 * sizeMultiplier}px`,
              imageRendering: 'pixelated'
            }}
          >
            <svg 
              width={36 * sizeMultiplier} 
              height={36 * sizeMultiplier} 
              viewBox="0 0 36 36"
              style={{ imageRendering: 'pixelated' }}
            >
              {/* Main building */}
              <rect x="8" y="18" width="20" height="16" fill="#CD853F" />
              {/* Roof */}
              <rect x="6" y="12" width="24" height="8" fill="#8B4513" />
              <rect x="8" y="10" width="20" height="4" fill="#654321" />
              <rect x="12" y="8" width="12" height="4" fill="#4A2C17" />
              {/* Windows */}
              <rect x="11" y="22" width="3" height="3" fill="#87CEEB" />
              <rect x="22" y="22" width="3" height="3" fill="#87CEEB" />
              <rect x="16" y="15" width="4" height="4" fill="#87CEEB" />
              {/* Door */}
              <rect x="16" y="26" width="4" height="8" fill="#654321" />
              {/* Decorative elements */}
              <rect x="10" y="16" width="16" height="2" fill="#8B4513" />
              <rect x="14" y="6" width="8" height="2" fill="#FF6347" />
              {/* Side extension */}
              <rect x="2" y="24" width="8" height="10" fill="#DEB887" />
              <rect x="0" y="20" width="12" height="6" fill="#BC9A6A" />
              <rect x="4" y="27" width="2" height="2" fill="#87CEEB" />
            </svg>
          </div>
        );

      case 'plaza':
        return (
          <div 
            className={`cursor-pointer transform hover:scale-110 transition-all duration-200 ${className}`}
            onClick={onClick}
            style={{ 
              width: `${40 * sizeMultiplier}px`, 
              height: `${40 * sizeMultiplier}px`,
              imageRendering: 'pixelated'
            }}
          >
            <svg 
              width={40 * sizeMultiplier} 
              height={40 * sizeMultiplier} 
              viewBox="0 0 40 40"
              style={{ imageRendering: 'pixelated' }}
            >
              {/* Plaza base */}
              <rect x="4" y="24" width="32" height="14" fill="#D2B48C" />
              {/* Central fountain */}
              <rect x="16" y="20" width="8" height="18" fill="#B0C4DE" />
              <rect x="14" y="18" width="12" height="4" fill="#778899" />
              {/* Water effect */}
              <rect x="17" y="16" width="2" height="4" fill="#87CEEB" />
              <rect x="21" y="16" width="2" height="4" fill="#87CEEB" />
              {/* Plaza pillars */}
              <rect x="6" y="20" width="4" height="18" fill="#696969" />
              <rect x="30" y="20" width="4" height="18" fill="#696969" />
              {/* Decorative arches */}
              <rect x="4" y="18" width="8" height="4" fill="#A9A9A9" />
              <rect x="28" y="18" width="8" height="4" fill="#A9A9A9" />
              {/* Steps */}
              <rect x="2" y="36" width="36" height="2" fill="#BC9A6A" />
              <rect x="4" y="34" width="32" height="2" fill="#DEB887" />
              {/* People silhouettes */}
              <rect x="10" y="30" width="2" height="6" fill="#4B0082" />
              <rect x="12" y="28" width="2" height="2" fill="#FFB6C1" />
              <rect x="26" y="32" width="2" height="4" fill="#228B22" />
              <rect x="28" y="30" width="2" height="2" fill="#FFB6C1" />
            </svg>
          </div>
        );

      default:
        return null;
    }
  };

  return getPixelArt();
}