import React from 'react';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 22, className = "", showText = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200`} style={{ width: size * 1.8, height: size * 1.8 }}>
        <Sparkles size={size} fill="currentColor" />
      </div>
      {showText && (
        <span className="text-xl font-bold tracking-tight text-neutral-900">
          ArteExpress <span className="text-indigo-600 italic">IA</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
