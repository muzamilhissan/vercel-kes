import React from 'react';

interface LoaderProps {
  message?: string;
  height?: string;
}

const Loader: React.FC<LoaderProps> = ({ message, height = '300px' }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: height,
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        height: '24px'
      }}>
        <div className="loader-dot" style={{ animationDelay: '0s' }}></div>
        <div className="loader-dot" style={{ animationDelay: '0.16s' }}></div>
        <div className="loader-dot" style={{ animationDelay: '0.32s' }}></div>
      </div>
      {message && (
        <p style={{
          color: '#64748b',
          fontWeight: 600,
          fontSize: '14px',
          margin: 0
        }}>
          {message}
        </p>
      )}
      <style>{`
        .loader-dot {
          width: 10px;
          height: 10px;
          background-color: #70309f;
          border-radius: 50%;
          display: inline-block;
          animation: dotBounce 1.4s infinite ease-in-out both;
        }
        @keyframes dotBounce {
          0%, 80%, 100% {
            transform: scale(0.7) translateY(0);
            opacity: 0.35;
          }
          40% {
            transform: scale(1.15) translateY(-12px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
