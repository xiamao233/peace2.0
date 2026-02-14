
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { QRCodeSVG } from 'qrcode.react';

// --- 类型定义 ---
interface UsageRecord {
  id: string;
  timestamp: string;
  comfortMessage?: string;
}

interface AppState {
  remainingCards: number;
  history: UsageRecord[];
}

// --- 模拟/服务逻辑 ---
const getComfortMessage = async (): Promise<string> => {
  const apiKey = window.process.env.API_KEY || '';
  if (!apiKey) return "情绪已寄存。无论此刻如何，明天太阳照常升起。晚安。";
  
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "用户正在使用一张'允许生气隔夜存档卡'。请提供一句简短、温柔的安抚语（50字内）。",
    });
    return response.text || "把烦恼留给月亮，明天醒来又是新的开始。";
  } catch (error) {
    return "已安全存档。现在请放心地去休息吧。";
  }
};

// --- 子组件 ---

const QRCodeModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  const targetUrl = 'https://xiamao233.github.io/peace2.0/';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-900 border border-white/20 p-8 rounded-3xl max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">分享这张卡片</h3>
          <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mb-6">
            <QRCodeSVG value={targetUrl} size={180} level="H" />
          </div>
          <button onClick={onClose} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:bg-white/10 transition-colors">知道了</button>
        </div>
      </div>
    </div>
  );
};

const HistoryList = ({ history }: { history: UsageRecord[] }) => {
  if (history.length === 0) return null;
  return (
    <div className="mt-8 w-full max-w-md">
      <h3 className="text-white/60 text-sm font-medium mb-3 px-2 flex items-center">
        <i className="fa-solid fa-clock-rotate-left mr-2 text-xs"></i>存档记录
      </h3>
      <div className="space-y-3">
        {history.slice().reverse().map((record) => (
          <div key={record.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 transition-all hover:bg-white/10">
            <div className="text-pink-300/80 text-xs font-mono mb-1">{new Date(record.timestamp).toLocaleString('zh-CN')}</div>
            <p className="text-white/90 text-sm italic leading-relaxed">“{record.comfortMessage}”</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ArchiveCard = ({ count, onUse, isLoading }: { count: number, onUse: () => void, isLoading: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative group perspective-1000 w-full max-w-sm aspect-[3/4] cursor-pointer" onClick={() => !isOpen && setIsOpen(true)}>
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
      <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${isOpen ? 'rotate-y-0' : 'hover:scale-105'}`}>
        <div className="absolute inset-0 bg-gray-900 border border-white/20 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-8 text-center backdrop-blur-xl">
          {!isOpen ? (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 mb-6 bg-gradient-to-br from-pink-500/20 to-indigo-500/20 rounded-full flex items-center justify-center animate-pulse">
                <i className="fa-solid fa-moon text-4xl text-pink-300"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">允许生气隔夜存档卡</h2>
              <p className="text-white/40 text-sm">点击开启你的专属特权</p>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-500">
              <div className="text-xs uppercase tracking-widest text-pink-400 font-bold mb-4 tracking-[0.3em]">Permission</div>
              <h1 className="text-2xl font-extrabold text-white mb-2 leading-tight">允许生气隔夜存档卡</h1>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-indigo-400 mb-8">*{count}</div>
              <p className="text-white/60 text-sm mb-10 leading-relaxed px-4">当你此刻无法平复，不必强求和解。<br/>这份契约允许你将情绪封存，交给明日处理。</p>
              <button 
                disabled={count <= 0 || isLoading} 
                onClick={(e) => { e.stopPropagation(); onUse(); }}
                className={`px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase transition-all ${count > 0 && !isLoading ? 'bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
              >
                {isLoading ? <i className="fa-solid fa-spinner animate-spin mr-2"></i> : "点击使用"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 主应用 ---

const App = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('stay_angry_state');
    return saved ? JSON.parse(saved) : { remainingCards: 3, history: [] };
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  useEffect(() => { localStorage.setItem('stay_angry_state', JSON.stringify(state)); }, [state]);

  const handleUseCard = async () => {
    if (state.remainingCards <= 0 || isLoading) return;
    setIsLoading(true);
    const message = await getComfortMessage();
    setState(prev => ({
      remainingCards: prev.remainingCards - 1,
      history: [...prev.history, { id: crypto.randomUUID(), timestamp: new Date().toISOString(), comfortMessage: message }]
    }));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 relative overflow-x-hidden">
      <div className="fixed top-6 right-6 z-40">
        <button onClick={() => setIsQRModalOpen(true)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"><i className="fa-solid fa-qrcode"></i></button>
      </div>
      <header className="mb-12 text-center relative z-10">
        <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] uppercase tracking-widest mb-4">Emotional Safe Space</div>
        <h2 className="text-white/80 text-lg font-light tracking-widest">不急于释怀，此刻即永恒</h2>
      </header>
      <main className="w-full flex flex-col items-center relative z-10">
        <ArchiveCard count={state.remainingCards} onUse={handleUseCard} isLoading={isLoading} />
        <HistoryList history={state.history} />
      </main>
      <footer className="mt-20 opacity-40 hover:opacity-100 transition-opacity">
        <button onClick={() => window.confirm("确定重置系统吗？") && setState({ remainingCards: 3, history: [] })} className="text-white/40 text-xs flex items-center mx-auto"><i className="fa-solid fa-rotate-right mr-1"></i>重置系统</button>
      </footer>
      <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
