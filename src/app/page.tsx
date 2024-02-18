'use client';

import Link from 'next/link';
import React from 'react';

import NavigationBar from '@/lib/NavigationBar';
const HomePage: React.FC = () => {
  return (
    <main style={{ overflow: 'hidden' }}>
      <NavigationBar />
      <div className='absolute h-[calc(100vh-7.5em)] w-4/5 ml-[20%] overflow-hidden bg-home-splash bg-cover bg-no-repeat'></div>
      <div className='h-[calc(100vh-7.5em)] w-[75em] z-10 float-left relative bg-sky-grad'>
        <h1 className='ml-[1em] mt-[0.5em] leading-[1em] h-[calc(100vh-7.5em)] relative text-9xl text-white'>
          <Link href='/dropzone'>
            <span className='text-apian-yellow'>Drop zone</span>
          </Link>{' '}
          selection and{' '}
          <Link href='cranespotting'>
            <span className='text-apian-yellow'>crane avoidance</span>
          </Link>
          {'  '}
          for drone deliveries
        </h1>
      </div>
    </main>
  );
};
export default HomePage;
