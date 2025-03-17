import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Home from '../pages/Home';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { useLogged } from '../hooks/loggedHook';

beforeEach(() => {
  vi.clearAllMocks();
});

vi.mock('../components/Chart', () => ({
  default: () => <div>Chart</div>,
}));

vi.mock('../components/CurencyConverter', () => ({
  default: () => <div>Currency Converter</div>,
}));

vi.mock('../components/Hero', () => ({
  default: () => <div>Hero</div>,
}));

vi.mock('../components/Navbar', () => ({
  default: ({ logged }: { logged: boolean }) => <div>{logged ? 'Logged In' : 'Logged Out'}</div>,
}));

vi.mock('../components/wallet', () => ({
  default: () => <div>Wallet</div>,
}));

vi.mock('../hooks/loggedHook', () => ({
  useLogged: vi.fn(),
}));

describe('Home Component', () => {
  test('renders the home page when logged in', () => {
    (useLogged as vi.Mock).mockReturnValue({ logged: true });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('Logged In')).toBeInTheDocument();
    expect(screen.getByText('Wallet')).toBeInTheDocument();
  });

  test('renders the home page when logged out', () => {
    (useLogged as vi.Mock).mockReturnValue({ logged: false });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('Logged Out')).toBeInTheDocument();
    expect(screen.getByText('Hero')).toBeInTheDocument();

  });
  
  test('handleRedirect should redirect to tradermade.com', async () => {
    (useLogged as vi.Mock).mockReturnValue({ logged: false });

    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' } as Location;
  
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
  
    const button = screen.getByRole('button', { name: 'More Info' });
  
    fireEvent.click(button);
  
    expect(window.location.href).toBe('https://tradermade.com/');
  
    window.location = originalLocation;
  })
});
