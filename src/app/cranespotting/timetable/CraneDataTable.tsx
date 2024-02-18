import { Feature, FeatureCollection, Point } from 'geojson';

import ToggleSlider from '@/lib/ToggleSlider';

interface CraneTableRowProps {
  crane: Feature<Point>;
  isSelected: boolean;
  // onSelect: (timestamp: number) => void;
  onSelect: () => void;
  count: number;
}

interface CraneDataTableProps {
  cranesFilteredByDay?: FeatureCollection<Point>;
  allCranes?: FeatureCollection<Point>;
  // selectedTimestamp: number;
  selectedTimestamps: number[];
  // onSelect: (timestamp: number) => void;
  onSelect: (timestamp: number[]) => void;
  testId?: string;
}

const CraneTableRow = ({
  crane,
  isSelected,
  onSelect,
  count,
}: CraneTableRowProps) => (
  <tr className='border-b-2 border-slate-750 rounded'>
    <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900'>
      <ToggleSlider checked={isSelected} onClick={onSelect} />
    </td>
    <td className='whitespace-nowrap px-6 py-4 text-lg font-medium text-gray-900'>
      {new Date(crane.properties?.timestamp * 1000).toLocaleTimeString()}
    </td>
    <td className='whitespace-nowrap px-6 py-4 text-lg text-gray-900'>
      {count} crane{count > 1 ? 's' : ''}
    </td>
  </tr>
);

// <input
//        type="radio"
//        name="selectedTime"
//        checked={isSelected}
//        onChange={onSelect}
//      />

export const CraneDataTable: React.FC<CraneDataTableProps> = ({
  cranesFilteredByDay,
  // selectedTimestamp,
  selectedTimestamps,
  onSelect,
  allCranes,
  testId,
}) => {
  return (
    <table style={{ width: '100%' }} data-testid={testId}>
      <thead className='bg-gray-100'>
        <tr>
          <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
            Select
          </th>
          <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
            Time
          </th>
          <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
            Cranes detected
          </th>
        </tr>
      </thead>
      <tbody className='bg-white'>
        {cranesFilteredByDay?.features?.map((crane, index) => (
          <CraneTableRow
            key={index}
            crane={crane}
            isSelected={selectedTimestamps.includes(
              crane.properties?.timestamp
            )}
            // isSelected={crane.properties?.timestamp === selectedTimestamp}
            onSelect={() =>
              onSelect(
                selectedTimestamps.includes(crane.properties?.timestamp)
                  ? selectedTimestamps.filter(
                      (timestamp) => timestamp != crane.properties?.timestamp
                    )
                  : [...selectedTimestamps, crane.properties?.timestamp]
              )
            }
            // onSelect
            // }
            count={
              allCranes?.features.filter(
                (feature) =>
                  feature?.properties?.timestamp === crane.properties?.timestamp
              ).length || 0
            }
          />
        ))}
      </tbody>
    </table>
  );
};
