
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // 使用用户要求的固定网址
  const targetUrl = 'https://xiamao233.github.io/peace2.0/';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-white/20 p-8 rounded-3xl max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">分享这张卡片</h3>
          <p className="text-white/40 text-xs mb-6 font-light">扫一扫，把“隔夜存档卡”带在身边</p>
          
          <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mb-6">
            <QRCodeSVG 
              value={targetUrl} 
              size={180}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/svgs/solid/moon.svg",
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </div>
          
          <p className="text-pink-300/60 text-[10px] break-all mb-8 px-4 font-mono">
            {targetUrl}
          </p>
          
          <button 
            onClick={onClose}
            className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:bg-white/10 transition-colors text-sm font-medium"
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
