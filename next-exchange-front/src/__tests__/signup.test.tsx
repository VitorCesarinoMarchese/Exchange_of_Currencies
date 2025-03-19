import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../app/signup/page';
import { vi } from 'vitest';
import { signupService } from '../services/signupService';
import { redirect } from 'next/navigation';

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

vi.mock('../services/signupService', () => ({
  signupService: vi.fn(),
}));
vi.mock('next/navigation',  () => ({redirect: vi.fn(),}));


describe('Register Component', () => {
  test('renders register form correctly', () => {
    render(
        <Register />
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Signup');

    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('example@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Strong Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Repeat Password')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /signup/i })).toBeInTheDocument();

    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
  });

  test('shows error when required fields are missing', async () => {
    render(
        <Register />
    );

    const signupButton = screen.getByRole('button', { name: /signup/i });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(screen.getByText('All fields need to be filled')).toBeInTheDocument();
    });
  });

  test('shows error when passwords do not match', async () => {
    render(
        <Register />
    );

    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('example@email.com'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Strong Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Repeat Password'), {
      target: { value: 'password124' },
    });

    const signupButton = screen.getByRole('button', { name: /signup/i });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(
        screen.getByText('The password need to be the same of the confirm password')
      ).toBeInTheDocument();
    });
  });

  test('navigates to login on successful signup', async () => {
    (signupService as unknown as jest.Mock) = signupService as unknown as jest.Mock;
    (signupService as unknown as jest.Mock).mockResolvedValue({
      data: { message: 'Account created successfully', error: null },
      error: null,
    });

    render(
        <Register />
    );

    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('example@email.com'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Strong Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Repeat Password'), {
      target: { value: 'password123' },
    });

    const signupButton = screen.getByRole('button', { name: /signup/i });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(signupService).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password123');
      expect(redirect).toHaveBeenCalledWith('/login');
      
    });
  });

  test('displays error from signup service on failure', async () => {
    (signupService as unknown as jest.Mock) = signupService as unknown as jest.Mock;
    (signupService as unknown as jest.Mock).mockResolvedValue({
      data: { error: true },
      error: 'Email is already taken',
    });

    render(
        <Register />
    );

    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('example@email.com'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Strong Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Repeat Password'), {
      target: { value: 'password123' },
    });

    const signupButton = screen.getByRole('button', { name: /signup/i });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(screen.getByText('Email is already taken')).toBeInTheDocument();
    });
  });

});
