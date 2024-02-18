import React, { PropsWithChildren } from 'react';

import MapIcon from '@/lib/MapIcon';

interface ErrorDisplayProps extends PropsWithChildren {
  message: string;
  isMapError?: boolean;
}
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, isMapError }) => {
  return (
    <div role='alert' className='px-4'>
      <div className='bg-red-500 text-white font-bold rounded-t px-4 py-2 '>
        Warning
      </div>
      <div
        className='border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700'
        style={{ height: '75%' }}
      >
        {isMapError && (
          <div
            className='grid grid-cols-1 grid-rows-2 gap-12'
            style={{ height: '100%' }}
          >
            <div className='my-4'>
              <div className='flex justify-center items-center'>
                <MapIcon className='text-red-700' testId='map-icon' />
              </div>
            </div>
            <div className='row-start-2 my-4'>
              <p>{message}</p>
            </div>
          </div>
        )}
        {!isMapError && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ErrorDisplay;
