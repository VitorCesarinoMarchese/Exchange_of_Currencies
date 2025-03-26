import React from 'react';
import { render, screen } from '@testing-library/react';
import History from '../app/[locale]/history/page';
import { vi } from 'vitest';
import { useLogged } from '../hooks/loggedHook';
import { NextIntlClientProvider } from 'next-intl';
import en from "../../messages/en-us.json";
import pt from "../../messages/pt-br.json";
import es from "../../messages/es-pe.json";

beforeEach(() => {
  vi.clearAllMocks();
});

vi.mock('../components/Navbar', () => ({
  default: ({ logged }: { logged: boolean }) => <div>{logged ? 'Logged In' : 'Logged Out'}</div>,
}));

vi.mock('../components/TransactionHistory', () => ({
  default: ({ reloadTrigger }: { reloadTrigger: boolean }) => <div data-testid="transaction-history">{reloadTrigger ? 'Reloaded' : 'Not Reloaded'}</div>,
}));

vi.mock('../hooks/loggedHook', () => ({
  useLogged: vi.fn(),
}));

describe('History Component', () => {
  test('renders the history page', () => {
    (useLogged as vi.Mock).mockReturnValue({ logged: true });
    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <History />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Logged In')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-history')).toBeInTheDocument();
    expect(screen.getByText('Not Reloaded')).toBeInTheDocument();
  });

  test('renders the history page in pt-br', () => {
    (useLogged as vi.Mock).mockReturnValue({ logged: true });
    render(
      <NextIntlClientProvider locale="pt-br" messages={pt}>
        <History />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Logged In')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-history')).toBeInTheDocument();
    expect(screen.getByText('Not Reloaded')).toBeInTheDocument();
  });

  test('renders the history page in es-pe', () => {
    (useLogged as vi.Mock).mockReturnValue({ logged: true });
    render(
      <NextIntlClientProvider locale="es-pe" messages={es}>
        <History />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Logged In')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-history')).toBeInTheDocument();
    expect(screen.getByText('Not Reloaded')).toBeInTheDocument();
  });
});
