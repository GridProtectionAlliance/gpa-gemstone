import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultiCheckBoxSelect from '../MultiCheckboxSelect';

const options = [
  { Value: 1, Label: 'Option One', Selected: false },
  { Value: 2, Label: 'Option Two', Selected: true }
];

function renderMultiSelect() {
  render(
    <MultiCheckBoxSelect
      Options={options}
      OnChange={jest.fn()}
    />
  );

  const button = screen.getByRole('button');
  const menu = document.querySelector('.popover') as HTMLDivElement;
  return { button, menu };
}

describe('MultiCheckBoxSelect dropdown', () => {
  it('closes when the trigger is clicked a second time', () => {
    const { button, menu } = renderMultiSelect();

    fireEvent.mouseDown(button);
    fireEvent.click(button);
    expect(menu).toHaveStyle({ display: 'block' });

    fireEvent.mouseDown(button);
    fireEvent.click(button);
    expect(menu).toHaveStyle({ display: 'none' });
  });

  it('stays open when an option is clicked', () => {
    const { button, menu } = renderMultiSelect();

    fireEvent.click(button);
    fireEvent.mouseDown(screen.getByText('Option One'));
    fireEvent.click(screen.getByText('Option One'));

    expect(menu).toHaveStyle({ display: 'block' });
  });

  it('closes when clicking outside the component', () => {
    const { button, menu } = renderMultiSelect();

    fireEvent.click(button);
    fireEvent.mouseDown(document.body);

    expect(menu).toHaveStyle({ display: 'none' });
  });
});
