import { cleanup, render, screen } from '@testing-library/react';

import { cranes } from '@/__mocks__/cranes';
import CraneTimeTable, {
  calculateTimestampsByDay,
  isOnSameDay,
} from '@/app/cranespotting/timetable/CraneTimeTable';

describe('CraneTimeTable', () => {
  afterEach(cleanup);

  describe('calculateTimestampsByDay', () => {
    test('returns an empty array when timestamps is empty', () => {
      const timestamps: number[] = [];
      const result = calculateTimestampsByDay(timestamps);
      expect(result).toEqual([]);
    });

    test('returns an array with a single day when timestamps has only one entry', () => {
      const timestamps: number[] = [1640995200]; // January 1, 2022
      const result = calculateTimestampsByDay(timestamps);
      expect(result).toEqual([1640995200]);
    });

    test('returns an array with multiple days when timestamps has multiple entries', () => {
      const timestamps: number[] = [
        1640995200, // January 1, 2022
        1641081600, // January 2, 2022
        1641168000, // January 3, 2022
      ];
      const result = calculateTimestampsByDay(timestamps);
      expect(result).toEqual([1640995200, 1641081600, 1641168000]);
    });

    test('groups timestamps by day', () => {
      const timestamps: number[] = [
        1640995200, // January 1, 2022
        1640998800, // January 1, 2022
        1641081600, // January 2, 2022
        1641168000, // January 3, 2022
        1641168000, // January 3, 2022
      ];
      const result = calculateTimestampsByDay(timestamps);
      expect(result).toEqual([1640995200, 1641081600, 1641168000]);
    });
  });

  test('renders TableLoading component when cranes prop is undefined', () => {
    render(
      <CraneTimeTable
        cranes={undefined}
        craneTimestamps={[]}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setCraneTimestamps={() => {}}
      />
    );
    const tableLoadingElement = screen.getByTestId('table-loading');
    expect(tableLoadingElement).toBeInTheDocument();
  });

  test('renders DateSelector component', () => {
    render(
      <CraneTimeTable
        cranes={cranes}
        craneTimestamps={[0]}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setCraneTimestamps={() => {}}
      />
    );
    const dateSelectorElement = screen.getByTestId('date-selector');
    expect(dateSelectorElement).toBeInTheDocument();
  });

  test('renders CraneDataTable component', () => {
    render(
      <CraneTimeTable
        cranes={cranes}
        craneTimestamps={[0]}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setCraneTimestamps={() => {}}
      />
    );
    const craneDataTableElement = screen.getByTestId('crane-data-table');
    expect(craneDataTableElement).toBeInTheDocument();
  });

  test('renders Footer component', () => {
    render(
      <CraneTimeTable
        cranes={cranes}
        craneTimestamps={[0]}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setCraneTimestamps={() => {}}
      />
    );
    const footerElement = screen.getByTestId('footer');
    expect(footerElement).toBeInTheDocument();
  });

  describe('isOnSameDay', () => {
    test('returns true when dates are on the same day', () => {
      const date1 = new Date(2022, 0, 1); // January 1, 2022
      const date2 = new Date(2022, 0, 1); // January 1, 2022
      expect(isOnSameDay(date1.getTime() / 1000, date2.getTime() / 1000)).toBe(
        true
      );
    });

    test('returns false when dates are not on the same day', () => {
      const date1 = new Date(2022, 0, 1); // January 1, 2022
      const date2 = new Date(2022, 0, 2); // January 2, 2022
      expect(isOnSameDay(date1.getTime() / 1000, date2.getTime() / 1000)).toBe(
        false
      );
    });

    test('returns false when either date is undefined', () => {
      const date1 = new Date(2022, 0, 1); // January 1, 2022
      expect(isOnSameDay(date1.getTime() / 1000, undefined)).toBe(false);
      expect(isOnSameDay(undefined, date1.getTime() / 1000)).toBe(false);
      expect(isOnSameDay(undefined, undefined)).toBe(false);
    });
  });
});
