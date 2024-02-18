'use client';

import { FeatureCollection, Point } from 'geojson';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

import ErrorDisplay from '@/lib/ErrorDisplay';
import MapLoading from '@/lib/MapLoading';
import NavigationBar from '@/lib/NavigationBar';
import { useGet } from '@/lib/useGet';

import CraneList from '@/app/cranespotting/CraneList';
import CraneTimeTable from '@/app/cranespotting/timetable/CraneTimeTable';

import CraneGallery from './CraneGallery';

const DynamicCraneMap = dynamic(() => import('./CraneMap'), {
  ssr: false,
  loading: () => <MapLoading />,
});

const CRANE_API = process.env.NEXT_PUBLIC_CRANE_API as string;

const CranespottingPage: React.FC = () => {
  const [craneTimestamps, setCraneTimestamps] = useState<number[]>([]);
  const [filteredCranes, setFilteredCranes] =
    useState<FeatureCollection<Point>>();
  const { data: cranesData, error: cranesError } = useGet<
    FeatureCollection<Point>
  >({
    url: CRANE_API,
  });

  useEffect(() => {
    if (cranesData) {
      setFilteredCranes({
        type: 'FeatureCollection',
        features: cranesData.features.filter((feature) =>
          craneTimestamps.includes(feature.properties?.timestamp)
        ),
      });
    }
  }, [craneTimestamps, cranesData]);

  return (
    <div className='overflow-hidden w-full h-[calc(100%)] flex flex-col'>
      <NavigationBar />
      {cranesError ? (
        <ErrorDisplay message={cranesError} />
      ) : (
        <div className='w-[calc(100%-3em)] overflow-hidden p-[0.5em] grid grid-cols-2 grid-rows-2 gap-[3em] m-[1.5em]'>
          <div className='w-full h-full'>
            <CraneTimeTable
              cranes={cranesData}
              craneTimestamps={craneTimestamps}
              setCraneTimestamps={setCraneTimestamps}
            />
          </div>
          <div className='h-[98%] w-[98%] shadow-box-grey rounded-lg'>
            <DynamicCraneMap cranes={filteredCranes} />
          </div>
          <div className='row-start-2 h-[80%] w-[80%] max-w-[98%] max-h-[98%] m-auto'>
            <CraneGallery cranes={filteredCranes} />
          </div>
          <div style={{ overflowY: 'scroll' }} className='row-start-2'>
            <CraneList cranes={filteredCranes} />
          </div>
        </div>
      )}
    </div>
  );
};
export default CranespottingPage;
