
import React, { useState, useEffect } from 'react';
import ArchiveCard from './components/ArchiveCard';
import HistoryList from './components/HistoryList';
import QRCodeModal from './components/QRCodeModal';
import { AppState, UsageRecord } from './types';
import { getComfortMessage } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('stay_angry_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    return {
      remainingCards: 3,
      history: []
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('stay_angry_state', JSON.stringify(state));
  }, [state]);

  const handleUseCard = async () => {
    if (state.remainingCards <= 0 || isLoading) return;

    setIsLoading(true);
    
    // Fetch a comforting message from Gemini
    const message = await getComfortMessage();
    
    const newRecord: UsageRecord = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      comfortMessage: message
    };

    setState(prev => ({
      remainingCards: prev.remainingCards - 1,
      history: [...prev.history, newRecord]
    }));

    setIsLoading(false);
  };

  const resetAll = () => {
    if (window.confirm("确定要重新获得 3 张存档卡并清空记录吗？")) {
      setState({
        remainingCards: 3,
        history: []
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 pb-24 relative overflow-x-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>

      {/* Share Button */}
      <div className="fixed top-6 right-6 z-40">
        <button 
          onClick={() => setIsQRModalOpen(true)}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-90"
          title="分享二维码"
        >
          <i className="fa-solid fa-qrcode"></i>
        </button>
      </div>

      <header className="mb-12 text-center relative z-10">
        <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] uppercase tracking-[0.2em] mb-4">
          Emotional Safe Space
        </div>
        <h2 className="text-white/80 text-lg font-light tracking-widest">不急于释怀，此刻即永恒</h2>
      </header>

      <main className="w-full flex flex-col items-center relative z-10">
        <ArchiveCard 
          count={state.remainingCards} 
          onUse={handleUseCard} 
          isLoading={isLoading} 
        />
        
        <HistoryList history={state.history} />
      </main>

      <footer className="mt-20 text-center opacity-40 hover:opacity-100 transition-opacity">
        <button 
          onClick={resetAll}
          className="text-white/40 hover:text-white/90 text-xs flex items-center mx-auto"
        >
          <i className="fa-solid fa-rotate-right mr-1"></i>
          重置系统
        </button>
        <p className="mt-4 text-[10px] text-white/30 tracking-wider uppercase">
          Powered by Gemini AI & Gentle Intentions
        </p>
      </footer>

      {/* Persistence Indicator */}
      <div className="fixed bottom-6 left-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-[10px] text-white/40 pointer-events-none">
        <i className="fa-solid fa-cloud-check mr-2 text-green-500/50"></i>
        已本地存档
      </div>

      {/* QR Code Modal */}
      <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
    </div>
  );
};

export default App;
