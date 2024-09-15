import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

import store from '../../../../../redux/store';
import AddCriteria from '..';
import {
  addCriteriaTitle,
  cancelButtonLabel,
  okButtonLabel,
} from '../../../../../constant/ConstantTexts';

function renderWithContext(element) {
  const { container, getByText } = render(
    <Provider store={store}>{element}</Provider>,
  );
  return { container, store, getByText };
}
describe('Test cases for AddCriteria', () => {
  test('Create the snapshots for AddCriteria', () => {
    const { container } = renderWithContext(<AddCriteria isOpen />);

    expect(container).toMatchSnapshot();
  });

  test('Should render the close icon correctly', () => {
    const onClose = jest.fn();
    renderWithContext(<AddCriteria isOpen={true} onClose={onClose} />);
    const buttons = screen.getAllByRole('button');
    const closeButton = buttons[0];

    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(onClose).toBeCalledTimes(1);
  });

  test('Should render the title correctly', () => {
    renderWithContext(<AddCriteria isOpen={true} />);
    const titleText = screen.getByRole('heading', { level: 3 });
    expect(titleText.textContent).toEqual(addCriteriaTitle);
  });

  test('Should render the segament component correctly', () => {
    renderWithContext(<AddCriteria isOpen={true} />);
    const radioButtons = screen.getAllByRole('radio');
    const inclusionButton = radioButtons[0];
    const exclusionButton = radioButtons[1];
    fireEvent.click(exclusionButton);
    fireEvent.click(inclusionButton);
    expect(inclusionButton).toHaveAttribute('checked', '');
  });

  test('Should render the inclusion and exclusion case study card correctly', () => {
    renderWithContext(<AddCriteria isOpen={true} />);
    const caseStudyCards = screen.getAllByTestId('case-study-card');
    const indicationCard = caseStudyCards[0];
    const medicationCard = caseStudyCards[1];
    const surgeryCard = caseStudyCards[2];
    const symptomCard = caseStudyCards[3];
    const alcoholCard = caseStudyCards[4];
    const allergiesCard = caseStudyCards[5];
    const bmiCard = caseStudyCards[6];
    const nicotineCard = caseStudyCards[7];
    const weightCard = caseStudyCards[8];
    const availabilityCard = caseStudyCards[9];
    const previousStudyCard = caseStudyCards[10];
    const demographicsCard = caseStudyCards[11];
    expect(indicationCard).toBeInTheDocument();
    expect(indicationCard.textContent).toContain('Indication');
    expect(medicationCard).toBeInTheDocument();
    expect(medicationCard.textContent).toContain('Medication');
    expect(surgeryCard).toBeInTheDocument();
    expect(surgeryCard.textContent).toContain('Surgery');
    expect(symptomCard).toBeInTheDocument();
    expect(symptomCard.textContent).toContain('Symptom');
    expect(alcoholCard).toBeInTheDocument();
    expect(alcoholCard.textContent).toContain('Alcohol');
    expect(allergiesCard).toBeInTheDocument();
    expect(allergiesCard.textContent).toContain('Allergies');
    expect(bmiCard).toBeInTheDocument();
    expect(bmiCard.textContent).toContain('Bmi');
    expect(nicotineCard).toBeInTheDocument();
    expect(nicotineCard.textContent).toContain('Nicotine');
    expect(weightCard).toBeInTheDocument();
    expect(weightCard.textContent).toContain('Weight');
    expect(availabilityCard).toBeInTheDocument();
    expect(availabilityCard.textContent).toContain('Availability');
    expect(previousStudyCard).toBeInTheDocument();
    expect(previousStudyCard.textContent).toContain('Previous study');
    expect(demographicsCard).toBeInTheDocument();
    expect(demographicsCard.textContent).toContain('Demographics');
  });

  test('Check the Titles function', () => {
    renderWithContext(<AddCriteria isOpen={true} />);
    const caseStudyCards = screen.getAllByTestId('case-study-card');
    const indicationCard = caseStudyCards[0];
    const medicationCard = caseStudyCards[1];
    const surgeryCard = caseStudyCards[2];
    const symptomCard = caseStudyCards[3];
    const alcoholCard = caseStudyCards[4];
    const allergiesCard = caseStudyCards[5];
    const bmiCard = caseStudyCards[6];
    const nicotineCard = caseStudyCards[7];
    const weightCard = caseStudyCards[8];
    const availabilityCard = caseStudyCards[9];
    const previousStudyCard = caseStudyCards[10];
    const demographicsCard = caseStudyCards[11];
    expect(indicationCard).toBeInTheDocument();
    expect(indicationCard.textContent).toContain('Indication');
    expect(medicationCard).toBeInTheDocument();
    expect(medicationCard.textContent).toContain('Medication');
    expect(surgeryCard).toBeInTheDocument();
    expect(surgeryCard.textContent).toContain('Surgery');
    expect(symptomCard).toBeInTheDocument();
    expect(symptomCard.textContent).toContain('Symptom');
    expect(alcoholCard).toBeInTheDocument();
    expect(alcoholCard.textContent).toContain('Alcohol');
    expect(allergiesCard).toBeInTheDocument();
    expect(allergiesCard.textContent).toContain('Allergies');
    expect(bmiCard).toBeInTheDocument();
    expect(bmiCard.textContent).toContain('Bmi');
    expect(nicotineCard).toBeInTheDocument();
    expect(nicotineCard.textContent).toContain('Nicotine');
    expect(weightCard).toBeInTheDocument();
    expect(weightCard.textContent).toContain('Weight');
    expect(availabilityCard).toBeInTheDocument();
    expect(availabilityCard.textContent).toContain('Availability');
    expect(previousStudyCard).toBeInTheDocument();
    expect(previousStudyCard.textContent).toContain('Previous study');
    expect(demographicsCard).toBeInTheDocument();
    expect(demographicsCard.textContent).toContain('Demographics');
    fireEvent.click(indicationCard);
    fireEvent.click(bmiCard);
    fireEvent.click(demographicsCard);

    expect(indicationCard).toHaveStyle('background-color: rgb(246, 247, 249)');
    expect(bmiCard).toHaveStyle('background-color: rgb(246, 247, 249)');
    expect(demographicsCard).toHaveStyle(
      'background-color: rgb(246, 247, 249)',
    );

    fireEvent.click(indicationCard);
    expect(indicationCard).toHaveStyle('background-color: white');
  });

  test('Should render the close icon correctly', () => {
    const onClose = jest.fn();
    renderWithContext(<AddCriteria isOpen={true} onClose={onClose} />);
    const buttons = screen.getAllByRole('button');
    const cancelButton = buttons[1];

    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton.textContent).toBe(cancelButtonLabel);
    fireEvent.click(cancelButton);
    expect(onClose).toBeCalledTimes(1);
  });

  test('Check the SaveConditions function', async () => {
    const onClose = jest.fn();
    const { store } = renderWithContext(
      <AddCriteria isOpen={true} onClose={onClose} />,
    );

    const caseStudyCards = screen.getAllByTestId('case-study-card');
    const indicationCard = caseStudyCards[0];
    const weightCard = caseStudyCards[8];
    const demographicsCard = caseStudyCards[11];

    expect(indicationCard).toBeInTheDocument();
    expect(indicationCard.textContent).toContain('Indication');
    expect(weightCard).toBeInTheDocument();
    expect(weightCard.textContent).toContain('Weight');
    expect(demographicsCard).toBeInTheDocument();
    expect(demographicsCard.textContent).toContain('Demographics');
    fireEvent.click(indicationCard);
    fireEvent.click(weightCard);
    fireEvent.click(demographicsCard);
    expect(indicationCard).toHaveStyle('background-color: rgb(246, 247, 249)');
    expect(weightCard).toHaveStyle('background-color: rgb(246, 247, 249)');
    expect(demographicsCard).toHaveStyle(
      'background-color: rgb(246, 247, 249)',
    );

    const buttons = screen.getAllByRole('button');
    const okButton = buttons[2];

    expect(okButton).toBeInTheDocument('');
    expect(okButton.textContent).toBe(okButtonLabel);
    fireEvent.click(okButton);

    await waitFor(() => {
      const { segments, activeSegment, cardValue } =
        store.getState().feasibilityStudyReducer;

      expect(segments[activeSegment.index]?.feasibilityStudy.length).toEqual(5);
      expect(cardValue).toEqual({
        index: 4,
        case: 'Demographics',
        condition: 'Inclusion',
      });

      expect(onClose).toBeCalledTimes(1);
    });
  });
});
