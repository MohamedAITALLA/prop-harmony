
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';

interface MainContentProps {
  children?: ReactNode;
}

export const MainContent = ({ children }: MainContentProps) => {
  return (
    <motion.div 
      className="flex-1 flex flex-col h-full overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 pb-24">
        {children || <Outlet />}
      </div>
    </motion.div>
  );
};
