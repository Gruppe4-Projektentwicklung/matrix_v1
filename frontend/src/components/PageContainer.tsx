import React from 'react';

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const PageContainer: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <div
      className={`w-full md:w-3/5 max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-10 my-10 ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export default PageContainer;
