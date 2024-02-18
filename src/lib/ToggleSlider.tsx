import React from 'react';

interface ToggleSliderProps {
  checked: boolean;
  onClick: () => void;
}

const ToggleSlider: React.FC<ToggleSliderProps> = ({ checked, onClick }) => {
  return (
    <div
      className='grid items-center w-[5em] grid-rows-1 grid-cols-1'
      onClick={onClick}
    >
      <div
        className={`w-[3em] h-[10px] border-1 rounded-[1em] shadow-inner ${
          checked ? 'bg-apian-yellow' : 'bg-slate-200'
        }`}
        style={{ gridRow: 1, gridColumn: 1 }}
      ></div>
      <div
        className='bg-white shadow  border-[1px] border-slate-300: float:top h-[20px] w-[20px] rounded-full'
        style={{
          gridRow: 1,
          gridColumn: 1,
          marginLeft: checked ? 'calc(3em - 10px)' : '-10px',
          transitionDelay: '500ms',
          transition: 'margin-left 500ms ease',
        }}
      ></div>
    </div>
  );
};

export default ToggleSlider;
