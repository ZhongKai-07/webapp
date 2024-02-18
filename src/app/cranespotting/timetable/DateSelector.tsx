import { useState } from 'react';

import { isOnSameDay } from '@/app/cranespotting/timetable/CraneTimeTable';

interface DateButtonProps {
  date: number;
  isSelected: boolean;
  onSelect: (timestamp: number) => void;
}

interface DateSelectorProps {
  dates: number[];
  selectedDay?: number;
  onSelect: (timestamp: number) => void;
  testId?: string;
}
const DateButton = ({ date, isSelected, onSelect }: DateButtonProps) => {
  const [pressed, setPressed] = useState<boolean>(false);
  return (
    <button
      className={`rounded-full px-5 py-1 text-base font-medium text-gray-700 border-2 border-apian-yellow ${
        isSelected
          ? 'bg-apian-yellow'
          : 'bg-white hover:bg-apian-yellow-opacity-50'
      } ${pressed ? 'shadow-inner shadow' : 'shadow'}`}
      key={date}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={() => onSelect(date)}
    >
      {new Date(date * 1000).toLocaleDateString()}
    </button>
  );
};

export const DateSelector: React.FC<DateSelectorProps> = ({
  dates,
  selectedDay,
  onSelect,
  testId,
}) => (
  <div className='flex justify-center space-x-2 p-3' data-testid={testId}>
    {dates.map((date) => (
      <DateButton
        key={date}
        date={date}
        isSelected={isOnSameDay(date, selectedDay)}
        onSelect={onSelect}
      />
    ))}
  </div>
);
