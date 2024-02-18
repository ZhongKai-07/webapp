/* eslint-disable @next/next/no-img-element */
import { FeatureCollection, Point } from 'geojson';
import React from 'react';

interface CraneListProps {
  cranes?: FeatureCollection<Point>;
}

const CraneList: React.FC<CraneListProps> = ({ cranes }) => {
  const sortedCranes = cranes
    ? {
        type: cranes.type,
        features: cranes.features.sort((a, b) => {
          const idA: number = a.properties?.craneId || 0;
          const idB: number = b.properties?.craneId || 0;
          return idA - idB;
        }),
      }
    : null;

  return cranes && cranes?.features?.length > 0 ? (
    <div className='overflow-auto p-2 w-100'>
      <ul className='m-0 list-none p-0 grid grid-cols-3 grid-rows-15 gap-2'>
        {sortedCranes &&
          sortedCranes.features.map(
            (feature) =>
              feature && (
                <li
                  key={feature?.properties?.craneId}
                  className='mb-2 rounded bg-white p-2 shadow-box-grey-sm'
                >
                  <div className='font-bold'>
                    Crane {feature?.properties?.craneId}
                  </div>
                  <div>Height: {feature.properties?.height}m</div>
                  <div>Radius: {feature.properties?.radius}m</div>
                </li>
              )
          )}
      </ul>
    </div>
  ) : (
    <div className='flex w-full h-full overflow-hidden justify-between'>
      <img
        className='ml-[-8em] w-[70%] mt-[-4em]'
        width={0}
        height={0}
        src='/images/missing_crane.png'
        alt='image of a crane'
      />
      <p className='w-[48%]  pr-[1em] text-5xl'>
        Select some timestamps to view crane data and images.
      </p>
    </div>
  );
};

export default CraneList;
