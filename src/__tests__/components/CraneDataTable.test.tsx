import { cleanup, render } from '@testing-library/react';
import { FeatureCollection, Point } from 'geojson';
import React from 'react';

import { CraneDataTable } from '@/app/cranespotting/timetable/CraneDataTable';

const cranesFilteredByDay: FeatureCollection<Point> = {
  type: 'FeatureCollection',
  features: [
    {
      id: '0',
      type: 'Feature',
      properties: {
        craneId: '1',
        height: 187,
        timestamp: 1705190400,
      },
      geometry: {
        type: 'Point',
        coordinates: [-0.11433123536651221, 51.497263819259494],
      },
    },
    {
      id: '1',
      type: 'Feature',
      properties: {
        craneId: '6',
        height: 61,
        timestamp: 1705276801,
      },
      geometry: {
        type: 'Point',
        coordinates: [-0.10701641144000305, 51.50180701131141],
      },
    },
    {
      id: '2',
      type: 'Feature',
      properties: {
        craneId: '21',
        height: 147,
        timestamp: 1705363201,
      },
      geometry: {
        type: 'Point',
        coordinates: [-0.1174855545800235, 51.5008315750743],
      },
    },
  ],
};

describe('CraneDataTable', () => {
  afterEach(cleanup);

  test('renders CraneDataTable with entire dataset correctly', () => {
    const selectedTimestamp = 1629878400;

    const { container } = render(
      <CraneDataTable
        cranesFilteredByDay={cranesFilteredByDay}
        selectedTimestamps={[selectedTimestamp]}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onSelect={() => {}}
        allCranes={cranesFilteredByDay}
      />
    );

    expect(container).toMatchSnapshot();
  });

  test('renders no cranes when cranesFilteredByDay is empty', () => {
    const { container } = render(
      <CraneDataTable
        cranesFilteredByDay={{ type: 'FeatureCollection', features: [] }}
        selectedTimestamps={[]}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onSelect={() => {}}
        allCranes={cranesFilteredByDay}
      />
    );

    expect(container).toMatchSnapshot();
    // Account for header
    expect(container.querySelectorAll('tr')).toHaveLength(1);
  });

  // test('calls onSelect with correct timestamp when a row is selected', () => {
  //   const onSelect = jest.fn();

  //   const { getByText } = render(
  //     <CraneDataTable
  //       cranesFilteredByDay={cranesFilteredByDay}
  //       selectedTimestamps={[]}
  //       onSelect={onSelect}
  //       allCranes={cranesFilteredByDay}
  //     />
  //   );

  //   // console.log(container);

  //   const firstRowTimeCell = getByText('12:00:00 AM'); // Adjust this text to match how your component displays the timestamp

  //   const tr = firstRowTimeCell.closest('tr');
  //   if (!tr) {
  //     throw new Error('tr not found');
  //   }
  //   fireEvent.click(tr);
  //   console.log(tr.innerHTML);

  //   // The expected timestamp should match the first object in your cranesFilteredByDay array
  //   expect(onSelect).toHaveBeenCalledWith(
  //     cranesFilteredByDay.features[0].properties?.timestamp
  //   );
  // });

  test('renders individual days correctly', () => {
    const testWithIndex = (
      ts: number,
      filteredCranes: FeatureCollection<Point>
    ) => {
      const { container } = render(
        <CraneDataTable
          cranesFilteredByDay={filteredCranes}
          selectedTimestamps={[ts]}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onSelect={() => {}}
          allCranes={cranesFilteredByDay}
        />
      );
      expect(container).toMatchSnapshot();
    };

    cranesFilteredByDay.features.forEach((feature, index) => {
      const selectedTimestamp =
        cranesFilteredByDay.features[index]?.properties?.timestamp;
      const filteredCranes: FeatureCollection<Point> = {
        type: 'FeatureCollection',
        features: cranesFilteredByDay.features.filter(
          (el) => el.properties?.timestamp === selectedTimestamp
        ),
      };

      testWithIndex(selectedTimestamp, filteredCranes);
    });
  });
});
