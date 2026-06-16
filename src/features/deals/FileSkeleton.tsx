import React from 'react';

export const SearchSkeleton: React.FC = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '38px', 
      borderRadius: '10px', 
      background: '#f8fafc', 
      border: '1.5px solid #f1f5f9',
      boxSizing: 'border-box',
      animation: 'pulse 1.5s ease-in-out infinite',
      marginBottom: '4px',
      position: 'relative',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.01)'
    }}>
      <div style={{
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        border: '2px solid #e2e8f0',
        boxSizing: 'border-box'
      }} />
      <div style={{
        position: 'absolute',
        left: '26px',
        top: '60%',
        width: '5px',
        height: '2px',
        background: '#e2e8f0',
        transform: 'rotate(45deg)'
      }} />
    </div>
  );
};

export const FileSkeleton: React.FC = () => {
  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '10px 14px', 
        background: '#ffffff', 
        borderRadius: '10px', 
        border: '1.5px solid #f1f5f9',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
        animation: 'pulse 1.5s ease-in-out infinite',
        boxSizing: 'border-box'
      }}
    >
      {/* Left: icon + details */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '70%' }}>
        {/* Icon placeholder */}
        <div style={{ 
          width: '18px', 
          height: '18px', 
          borderRadius: '4px', 
          background: '#e2e8f0', 
          flexShrink: 0 
        }} />
        
        {/* Text placeholders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
          {/* Title placeholder */}
          <div style={{ 
            width: '65%', 
            height: '12px', 
            borderRadius: '3px', 
            background: '#e2e8f0' 
          }} />
          
          {/* Subtitle placeholder */}
          <div style={{ 
            width: '40%', 
            height: '8px', 
            borderRadius: '2px', 
            background: '#e2e8f0' 
          }} />
        </div>
      </div>

      {/* Right: actions placeholders */}
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#e2e8f0' }} />
        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#e2e8f0' }} />
      </div>
    </div>
  );
};
