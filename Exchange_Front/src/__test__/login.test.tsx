import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { loginService } from '../services/loginService';

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

vi.mock('../components/Btn', () => ({
  default: ({
    label,
    func,
    disable,
    ...props
  }: {
    label: string;
    func: () => void;
    disable: boolean;
    [key: string]: any;
  }) => <button onClick={func} disabled={disable} {...props}>{label}</button>,
}));

vi.mock('../components/Input', () => ({
  default: ({
    change,
    ...props
  }: {
    change: (e: React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: any;
  }) => <input onChange={change} {...props} />,
}));

vi.mock('../components/Navbar', () => ({
  default: ({ logged }: { logged: boolean }) => <div>{logged ? 'Logged In' : 'Logged Out'}</div>,
}));

vi.mock('../services/loginService', () => ({
  loginService: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    NavLink: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

describe('Login Component', () => {
  test('renders login form correctly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Login');

    expect(screen.getByPlaceholderText('example@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Strong Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
  });

  test('shows error when invalid credentials are provided', async () => {
    (loginService as unknown as jest.Mock).mockResolvedValue({
      data: null,
      error: 'Invalid credentials',
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('example@email.com'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Strong Password'), {
      target: { value: 'wrongpassword' },
    });

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('navigates to homepage on successful login', async () => {
    (loginService as unknown as jest.Mock).mockResolvedValue({
      data: { user: { id: 1, email: 'test@example.com' }, accessToken: 'token' },
      error: null,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('example@email.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Strong Password'), {
      target: { value: 'password123' },
    });

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(loginService).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('disables login button when loading', async () => {
    let resolveLogin: (value: any) => void;
    (loginService as unknown as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLogin = resolve;
        })
    );

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    expect(loginButton).toHaveTextContent('Logging in...');
    expect(loginButton).toBeDisabled();

    resolveLogin({
      data: { user: { id: 1, email: 'test@example.com' }, accessToken: 'token' },
      error: null,
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});