import { render, screen } from '@testing-library/react';

import Infocard from '../components/Infocard'; 

describe('Infocard Component', () => {
  it('renders the title, text, and label correctly', () => {

    render(<Infocard title="Card Title" text="This is a description text" label="Click Me" />);

    const titleElement = screen.getByText("Card Title");
    expect(titleElement).toBeInTheDocument();

    const textElement = screen.getByText("This is a description text");
    expect(textElement).toBeInTheDocument();

    const buttonElement = screen.getByText("Click Me");
    expect(buttonElement).toBeInTheDocument();
  });

  it('has the correct class names applied', () => {
    render(<Infocard title="Card Title" text="Text here" label="Click Me" />);

    const cardElement = screen.getByText("Card Title").closest('div');
    expect(cardElement).toHaveClass('bg-primary', 'rounded-xl', 'text-center');
  });

  it('should render the Btn component inside the Infocard', () => {
    render(<Infocard title="Card Title" text="Text here" label="Click Me" />);

    const buttonElement = screen.getByText("Click Me");
    expect(buttonElement).toBeInTheDocument();
  });
});
