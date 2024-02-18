import { Feature, FeatureCollection, Point } from 'geojson';
import React, { useEffect, useState } from 'react';

import TableLoading from '@/lib/TableLoading';

import { CraneDataTable } from '@/app/cranespotting/timetable/CraneDataTable';
import { DateSelector } from '@/app/cranespotting/timetable/DateSelector';
import { Footer } from '@/app/cranespotting/timetable/Footer';

interface CraneTimeTableProps {
  cranes?: FeatureCollection<Point>;
  craneTimestamps: number[];
  setCraneTimestamps: React.Dispatch<React.SetStateAction<number[]>>;
  testId?: string;
}

export const isOnSameDay = (
  date1Num: number | undefined,
  date2Num: number | undefined
) => {
  const date1 = date1Num ? new Date(date1Num * 1000) : null;
  const date2 = date2Num ? new Date(date2Num * 1000) : null;
  if (!date1 || !date2) return false;
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const calculateTimestampsByDay = (timestamps: number[]) =>
  timestamps.filter((timestamp, index) => {
    const currentDate = new Date(timestamp * 1000);
    const previousDate =
      index > 0 ? new Date(timestamps[index - 1] * 1000) : null;
    return (
      previousDate === null ||
      currentDate.getDate() !== previousDate.getDate() ||
      currentDate.getMonth() !== previousDate.getMonth() ||
      currentDate.getFullYear() !== previousDate.getFullYear()
    );
  });

const CraneTimeTable: React.FC<CraneTimeTableProps> = ({
  cranes,
  craneTimestamps,
  setCraneTimestamps,
  testId,
}) => {
  const [deduplicatedCranes, setDeduplicatedCranes] =
    useState<FeatureCollection<Point>>();
  const [displayedCranes, setDisplayedCranes] =
    useState<FeatureCollection<Point>>();
  const [craneDates, setCraneDates] = useState<number[]>([]);
  const [craneSelectedDay, setCraneSelectedDay] = useState<number>();

  useEffect(() => {
    if (craneSelectedDay && deduplicatedCranes) {
      setDisplayedCranes({
        type: 'FeatureCollection',
        features: deduplicatedCranes.features.filter((feature) =>
          isOnSameDay(feature.properties?.timestamp, craneSelectedDay)
        ),
      });
    }
  }, [craneSelectedDay, deduplicatedCranes]);

  useEffect(() => {
    const timestamps = Array.from(
      new Set(
        (cranes as FeatureCollection<Point>)?.features
          .map((feature) => feature.properties?.timestamp)
          .filter((el) => !!el)
      )
    ) as number[];
    const deduplicatedCranes: FeatureCollection<Point> = {
      type: 'FeatureCollection',
      features: timestamps
        .map((timestamp) =>
          cranes?.features.find(
            (feature) => feature.properties?.timestamp === timestamp
          )
        )
        .filter(Boolean) as Feature<Point>[],
    };
    setDeduplicatedCranes(deduplicatedCranes);
    setDisplayedCranes(deduplicatedCranes);

    const timestampsByDay = calculateTimestampsByDay(timestamps);
    setCraneDates(timestampsByDay);
    setCraneSelectedDay(timestampsByDay[0]);
  }, [cranes]);

  if (!cranes) return <TableLoading />;
  return (
    <div className='flex flex-col' data-testid={testId}>
      <DateSelector
        dates={craneDates}
        selectedDay={craneSelectedDay}
        onSelect={setCraneSelectedDay}
        testId='date-selector'
      />
      <CraneDataTable
        cranesFilteredByDay={displayedCranes}
        allCranes={cranes}
        selectedTimestamps={craneTimestamps}
        onSelect={setCraneTimestamps}
        testId='crane-data-table'
      />
      <Footer
        lastRefreshTime={new Date(craneTimestamps[0] * 1000).toLocaleString()}
        testId='footer'
      />
      <div className='flex w-full justify-center'>
        <button
          className='rounded-full w-1/3 content-center  px-5 py-1 text-base font-medium text-gray-700 border-2 border-apian-yellow active:bg-apian-yellow hover:bg-apian-yellow-opacity-50'
          onClick={() => {
            setCraneTimestamps([]);
          }}
        >
          Clear Selections - (
          {
            cranes?.features?.filter((feature) =>
              craneTimestamps.includes(feature.properties?.timestamp)
            ).length
          }{' '}
          selected)
        </button>
      </div>
    </div>
  );
};

export default CraneTimeTable;
