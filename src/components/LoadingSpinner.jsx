import React from 'react';

const LoadingSpinner = ({ fullScreen = false, size = "md", message = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const spinnerClass = `${sizeClasses[size]} rounded-full border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin`;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
        <div className={spinnerClass}></div>
        <p className="mt-4 text-zinc-300">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className={spinnerClass}></div>
      <p className="mt-4 text-zinc-300">{message}</p>
    </div>
  );
};

export default LoadingSpinner;