import { FeatureCollection, Point } from 'geojson';
import React from 'react';
import Slider from 'react-animated-slider';

import 'react-animated-slider/build/horizontal.css';

import ImageLoading from '@/lib/ImageLoading';

interface CraneGalleryProps {
  cranes?: FeatureCollection<Point>;
}

const CraneGallery: React.FC<CraneGalleryProps> = ({ cranes }) => {
  return cranes && cranes?.features?.length > 0 ? (
    <Slider duration={100}>
      {cranes?.features?.map((feature, index) => (
        <div key={index}>
          <div>
            <p key={index} className='whitespace-nowrap text-lg text-gray-900'>
              {'Crane '}
              {feature.properties?.craneId}
              {'   '}
              {new Date(feature.properties?.timestamp * 1000).toLocaleString()}
            </p>
          </div>
          <div
            key={index}
            style={{
              height: '100%',
              background: `url('${feature.properties?.image}') no-repeat center center`,
            }}
          ></div>
        </div>
      ))}
    </Slider>
  ) : (
    <div className='w-full h-full'>
      <ImageLoading className='h-full w-full' />
    </div>
  );
};
export default CraneGallery;
