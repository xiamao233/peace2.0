
import React from 'react';
import { UsageRecord } from '../types';

interface HistoryListProps {
  history: UsageRecord[];
}

const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-8 w-full max-w-md">
      <h3 className="text-white/60 text-sm font-medium mb-3 px-2 flex items-center">
        <i className="fa-solid fa-clock-rotate-left mr-2 text-xs"></i>
        存档记录
      </h3>
      <div className="space-y-3">
        {history.map((record) => (
          <div 
            key={record.id} 
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 transition-all hover:bg-white/10"
          >
            <div className="text-pink-300/80 text-xs font-mono mb-1">
              {new Date(record.timestamp).toLocaleString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <p className="text-white/90 text-sm italic leading-relaxed">
              “{record.comfortMessage}”
            </p>
          </div>
        )).reverse()}
      </div>
    </div>
  );
};

export default HistoryList;
