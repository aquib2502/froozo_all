import React from 'react';

const FroozoLogo = ({ size = 'md', white = false }) => {
  const sizes = {
    sm: { icon: 'w-7 h-7 text-sm', text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9 text-base', text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12 text-xl', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16 text-3xl', text: 'text-3xl', sub: 'text-sm' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${s.icon} rounded-xl flex items-center justify-center flex-shrink-0`}
        style={{
          background: white
            ? 'rgba(255,255,255,0.15)'
            : 'linear-gradient(135deg, #4A2C17 0%, #8B5E3C 100%)',
          boxShadow: white ? 'none' : '0 2px 8px rgba(74,44,23,0.3)',
        }}
      >
        <span style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))' }}>☕</span>
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={`${s.text} font-black tracking-tight`}
          style={{
            color: white ? '#fff' : '#4A2C17',
            fontFamily: 'Georgia, serif',
            letterSpacing: '-0.5px',
          }}
        >
          Froozo
        </span>
        <span
          className={`${s.sub} font-semibold tracking-widest uppercase`}
          style={{ color: white ? 'rgba(255,255,255,0.7)' : '#C4843A', letterSpacing: '0.12em' }}
        >
          Cafe POS
        </span>
      </div>
    </div>
  );
};

export default FroozoLogo;
