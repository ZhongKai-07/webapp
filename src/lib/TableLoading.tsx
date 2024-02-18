const TableRow = ({ index }: { index: number }) => (
  <div
    className={`flex items-center justify-between ${index != 0 ? 'pt-4' : ''}`}
  >
    <div>
      <div className='h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5'></div>
      <div className='w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700'></div>
    </div>
    <div className='h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12'></div>
  </div>
);

const TableLoading: React.FC = () => {
  const rows = 5;
  return (
    <div
      data-testid='table-loading'
      role='status'
      className='max-w-md p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700'
    >
      {[...Array(rows)].map((_, i) => (
        <TableRow index={i} key={i} />
      ))}

      <span className='sr-only'>Loading...</span>
    </div>
  );
};

export default TableLoading;
