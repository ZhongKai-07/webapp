import {
  GeographySelection,
  PredefinedSelection,
} from '@/app/dropzone/GeographySelection';

interface GeographySelectionButtonsProps {
  onIndividualButtonClick: () => void;
  onPredefinedSelectionButtonClick: (selection: string) => void;
  geographySelection: GeographySelection;
  renderPreSelected: boolean;
}

export const GeographySelectionButtons: React.FC<
  GeographySelectionButtonsProps
> = ({
  onIndividualButtonClick,
  onPredefinedSelectionButtonClick,
  geographySelection,
  renderPreSelected,
}) => {
  return (
    <div className='w-1/3justify-center flex gap-[1em] mt-[1em]'>
      <button
        className={`rounded-full px-5 py-1 text-base font-medium text-gray-700 border-2 border-apian-yellow ${
          geographySelection === GeographySelection.Individual
            ? 'bg-apian-yellow'
            : 'bg-white hover:bg-apian-yellow-opacity-50'
        }`}
        onClick={() => onIndividualButtonClick()}
      >
        Individual
      </button>
      {renderPreSelected &&
        Object.entries(PredefinedSelection).map((selection) => (
          <button
            className={`rounded-full px-5 py-1 text-base font-medium text-gray-700 border-2 border-apian-yellow ${
              geographySelection ===
              (selection[1] as unknown as GeographySelection)
                ? 'bg-apian-yellow'
                : 'bg-white hover:bg-apian-yellow-opacity-50'
            }`}
            onClick={() => onPredefinedSelectionButtonClick(selection[1])}
            key={selection[0]}
          >
            {selection[1].charAt(0).toUpperCase() + selection[1].slice(1)}
          </button>
        ))}
    </div>
  );
};
