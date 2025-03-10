
import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary', fullScreen = false, message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };
  
  const colorClasses = {
    primary: 'border-t-primary',
    secondary: 'border-t-secondary',
    white: 'border-t-white'
  };

  const Container = fullScreen ? 
    ({ children }) => (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50">
        {children}
      </div>
    ) : 
    ({ children }) => (
      <div className="flex flex-col items-center justify-center py-10">
        {children}
      </div>
    );

  return (
    <Container>
      <div className={`${sizeClasses[size]} rounded-full border-gray-600 ${colorClasses[color]} animate-spin`}></div>
      {message && <p className="mt-4 text-zinc-300">{message}</p>}
    </Container>
  );
};

export default LoadingSpinner;
