import { cleanup, render, screen } from '@testing-library/react';

import { DateSelector } from '@/app/cranespotting/timetable/DateSelector';

const origDate = global.Date.prototype.toLocaleDateString;
jest
  .spyOn(global.Date.prototype, 'toLocaleDateString')
  .mockImplementation(function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return origDate.call(this, 'en-GB');
  });

describe('DateSelector', () => {
  const timestamps = [1627833600, 1627920000, 1628006400];
  const selectedDay = timestamps[1];
  afterEach(cleanup);

  it('should render correctly', () => {
    const onSelect = jest.fn();
    render(
      <DateSelector
        dates={timestamps}
        selectedDay={selectedDay}
        onSelect={onSelect}
      />
    );

    expect(screen.getByText('01/08/2021')).toBeInTheDocument();
    expect(screen.getByText('02/08/2021')).toBeInTheDocument();
    expect(screen.getByText('03/08/2021')).toBeInTheDocument();
    expect(screen.getByText('02/08/2021')).toHaveClass(
      'rounded-full px-5 py-1 text-base font-medium text-gray-700 border-2 border-apian-yellow bg-apian-yellow shadow'
    );
  });

  it('should call onSelect when a date button is clicked', () => {
    const onSelect = jest.fn();
    render(
      <DateSelector
        dates={timestamps}
        selectedDay={selectedDay}
        onSelect={onSelect}
      />
    );

    const dateButton = screen.getByText('03/08/2021');
    dateButton.click();

    expect(onSelect).toHaveBeenCalledWith(1628006400);
  });

  it('should match the snapshot', () => {
    const onSelect = jest.fn();
    const { container } = render(
      <DateSelector
        dates={timestamps}
        selectedDay={selectedDay}
        onSelect={onSelect}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
