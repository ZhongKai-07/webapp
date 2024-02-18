import { cleanup, render, screen } from '@testing-library/react';

import {
  GeographySelection,
  PredefinedSelection,
} from '@/app/dropzone/GeographySelection';
import { GeographySelectionButtons } from '@/app/dropzone/GeographySelectionButtons';

describe('GeographySelectionButtons', () => {
  afterEach(cleanup);
  it('should match the snapshot with preselected', () => {
    const { container } = render(
      <GeographySelectionButtons
        onIndividualButtonClick={jest.fn()}
        onPredefinedSelectionButtonClick={jest.fn()}
        geographySelection={GeographySelection.Individual}
        renderPreSelected={true}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot without preselected', () => {
    const { container } = render(
      <GeographySelectionButtons
        onIndividualButtonClick={jest.fn()}
        onPredefinedSelectionButtonClick={jest.fn()}
        geographySelection={GeographySelection.Individual}
        renderPreSelected={false}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('should call onIndividualButtonClick when individual button is clicked', () => {
    const onIndividualButtonClick = jest.fn();
    render(
      <GeographySelectionButtons
        onIndividualButtonClick={onIndividualButtonClick}
        onPredefinedSelectionButtonClick={jest.fn()}
        geographySelection={GeographySelection.Individual}
        renderPreSelected={true}
      />
    );

    const individualButton = screen.getByText('Individual');
    individualButton.click();

    expect(onIndividualButtonClick).toHaveBeenCalledTimes(1);
  });

  it('should call onPredefinedSelectionButtonClick with the correct selection when predefined selection button is clicked', () => {
    const onPredefinedSelectionButtonClick = jest.fn();
    const { rerender } = render(
      <GeographySelectionButtons
        onIndividualButtonClick={jest.fn()}
        onPredefinedSelectionButtonClick={onPredefinedSelectionButtonClick}
        geographySelection={GeographySelection.Individual}
        renderPreSelected={true}
      />
    );

    const predefinedSelectionButtons = screen
      .getAllByRole('button')
      .filter((button) => {
        return button.textContent !== 'Individual';
      });

    for (let index = 0; index < predefinedSelectionButtons.length; index++) {
      const button = predefinedSelectionButtons[index];
      button.click();

      expect(onPredefinedSelectionButtonClick).toHaveBeenNthCalledWith(
        index + 1,
        Object.values(PredefinedSelection)[index]
      );

      rerender(
        <GeographySelectionButtons
          onIndividualButtonClick={jest.fn()}
          onPredefinedSelectionButtonClick={onPredefinedSelectionButtonClick}
          geographySelection={
            Object.values(PredefinedSelection)[
              index
            ] as unknown as GeographySelection
          }
          renderPreSelected={true}
        />
      );

      expect(
        screen.getAllByRole('button').filter((filteredButton) => {
          return filteredButton.textContent == button.textContent;
        })[0]
      ).toHaveClass(
        'rounded-full px-5 py-1 text-base font-medium text-gray-700 border-2 border-apian-yellow bg-apian-yellow'
      );
    }
  });
});
