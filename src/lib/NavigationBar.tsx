/* eslint-disable @next/next/no-img-element */
import React from 'react';

import NavigationBarItem from '@/lib/NavigationBarItem';

const NavigationBar: React.FC = () => {
  return (
    <div className='flex justify-between w-full bg-white border-b-2 h-[7.5em]'>
      <div className='ml-[2em] relative flex justify-evenly items-center'>
        <img
          className='float-left reletive w-[10em]'
          width={0}
          height={0}
          alt='apian logo'
          src='/images/Apian_logo_transparent_bg.png'
        />
        <div className='relative block bg-black h-[3.5em] w-[2px] mx-[10px]'></div>
        <img
          className='float-left relative w-[10em]'
          width={0}
          height={0}
          alt='UCL logo'
          src='/images/ucl_logo.jpg'
        />
        <p className='relative w-[15em] text-4xl whitespace-nowrap'>
          Drone Deliveries
        </p>
      </div>
      <div className='mr-[5em] items-center flex relative h-full'>
        <nav className='relative'>
          <ul className='items-center text-2xl flex justify-around gap-[2em] relative'>
            <NavigationBarItem pathname='/' title='Home' />
            <NavigationBarItem
              pathname='/cranespotting'
              title='Crane Spotting'
            />
            <NavigationBarItem pathname='/dropzone' title='Drop Zone' />
          </ul>
        </nav>
      </div>
    </div>
  );
};
export default NavigationBar;
