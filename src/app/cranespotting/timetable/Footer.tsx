export const Footer: React.FC<{ lastRefreshTime: string; testId?: string }> = ({
  lastRefreshTime,
  testId,
}) => (
  <div
    className='bg-white p-2 text-center text-sm text-gray-600'
    data-testid={testId}
  >
    Last Data refresh: {lastRefreshTime}
  </div>
);
