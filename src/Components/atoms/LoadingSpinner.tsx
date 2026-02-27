import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  fullScreen?: boolean;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '', 
  text,
  fullScreen = false,
  color = 'primary'
}) => {
  
  const pxSize = {
    sm: 24,
    md: 48,
    lg: 80,
    xl: 120
  }[size];

  const borderSize = size === 'sm' ? 2 : size === 'lg' ? 6 : size === 'xl' ? 8 : 4; 

  const getThemeColors = () => {
      if (color === 'white') {
          return { 
              main: '#ffffff', 
              accent: '#f0f2f4'
          };
      }
      return { 
          main: '#17191c',
          accent: '#5c6670'
      };
  };

  const { main, accent } = getThemeColors();

  const animationStyles = `
    @keyframes rotation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className} relative z-10`}>
      <style>{animationStyles}</style>
      
      <div style={{ position: 'relative', width: pxSize, height: pxSize }}>
          
          <div 
             style={{
                 width: pxSize,
                 height: pxSize,
                 borderRadius: '50%',
                 display: 'inline-block',
                 borderTop: `${borderSize}px solid ${main}`,
                 borderRight: `${borderSize}px solid transparent`,
                 boxSizing: 'border-box',
                 animation: 'rotation 1s linear infinite'
             }}
          />

          <div 
             style={{
                 content: "''",
                 boxSizing: 'border-box',
                 position: 'absolute',
                 left: 0,
                 top: 0,
                 width: pxSize,
                 height: pxSize,
                 borderRadius: '50%',
                 borderLeft: `${borderSize}px solid ${accent}`,
                 borderBottom: `${borderSize}px solid transparent`,
                 animation: 'rotation 0.5s linear infinite reverse'
             }}
          />
      </div>

      {text && (
        <span className={`text-xs font-bold uppercase tracking-widest ${color === 'white' ? 'text-white' : 'text-gunmetal-600'} animate-pulse`}>
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center">
         {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;
