import React from 'react';

interface GardenProgressProps {
  current?: number;
  total?: number;
}

const GardenProgress: React.FC<GardenProgressProps> = ({ current = 0, total = 0 }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className='flex items-center gap-2'>
      <div className='relative h-9 w-36 overflow-hidden rounded-lg border border-gray-400 bg-gray-100/40'>
        <div
          className='h-full bg-lime-400 transition-all duration-500'
          style={{ width: `${percentage}%` }}
        />
        <span className='absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700'>
          {percentage}%
        </span>
      </div>
    </div>
  );
}

export default GardenProgress;
