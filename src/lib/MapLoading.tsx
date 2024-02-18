import MapIcon from '@/lib/MapIcon';

const MapLoading = () => {
  return (
    <div
      role='status'
      className='flex animate-pulse items-center justify-center rounded-lg bg-gray-300 dark:bg-gray-700'
      style={{ width: '100%', height: '100%' }}
    >
      <MapIcon />
      <span className='sr-only'>Loading...</span>
    </div>
  );
};

export default MapLoading;
