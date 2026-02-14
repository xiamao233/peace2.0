
import React, { useState } from 'react';

interface ArchiveCardProps {
  count: number;
  onUse: () => void;
  isLoading: boolean;
}

const ArchiveCard: React.FC<ArchiveCardProps> = ({ count, onUse, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCardClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative group perspective-1000 w-full max-w-sm aspect-[3/4] cursor-pointer" onClick={handleCardClick}>
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      
      <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${isOpen ? 'rotate-y-0 scale-100' : 'hover:scale-105'}`}>
        
        {/* Card Body */}
        <div className={`absolute inset-0 bg-gray-900 border border-white/20 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-8 text-center backdrop-blur-xl transition-all duration-500`}>
          
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-pink-500/30 rounded-tl-2xl m-4"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-indigo-500/30 rounded-br-2xl m-4"></div>

          {!isOpen ? (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 mb-6 bg-gradient-to-br from-pink-500/20 to-indigo-500/20 rounded-full flex items-center justify-center animate-pulse">
                <i className="fa-solid fa-moon text-4xl text-pink-300"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">存档卡</h2>
              <p className="text-white/40 text-sm">点击开启你的专属特权</p>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-500">
              <div className="text-xs uppercase tracking-widest text-pink-400 font-bold mb-4">Overnight Permission</div>
              <h1 className="text-3xl font-extrabold text-white mb-2 leading-tight">
                允许生气隔夜存档卡
              </h1>
              <div className="flex items-center justify-center space-x-2 mb-8">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-indigo-400">
                  *{count}
                </span>
              </div>
              
              <p className="text-white/60 text-sm mb-10 leading-relaxed px-4">
                当你此刻无法平复，不必强求和解。<br/>
                这份契约允许你将情绪封存，交给明日处理。
              </p>

              <button
                disabled={count <= 0 || isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  onUse();
                }}
                className={`
                  relative px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase transition-all
                  ${count > 0 && !isLoading 
                    ? 'bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:scale-105 active:scale-95' 
                    : 'bg-white/10 text-white/30 cursor-not-allowed'}
                `}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <i className="fa-solid fa-spinner animate-spin mr-2"></i>
                    存档中...
                  </span>
                ) : count > 0 ? (
                  "点击使用"
                ) : (
                  "存档卡已耗尽"
                )}
              </button>

              {count > 0 && (
                <div className="mt-6 flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 w-8 rounded-full transition-colors duration-500 ${i < count ? 'bg-pink-500' : 'bg-white/10'}`}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchiveCard;
