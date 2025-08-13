import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Post from '../pages/Post';

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ currentUser: { id: 'test-user' } }),
}));
jest.mock('../hooks/usePosts', () => ({
  usePosts: () => ({ createPost: jest.fn(), isCreatingPost: false }),
}));
jest.mock('../lib/store', () => ({
  useAppStore: () => ({ setError: jest.fn(), clearError: jest.fn() }),
}));
jest.mock('../lib/supabase', () => ({
  storage: { uploadPostImages: jest.fn(async () => []) },
}));

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient();
  return render(
    <MemoryRouter>
      <QueryClientProvider client={qc}>{ui}</QueryClientProvider>
    </MemoryRouter>
  );
}

test('price input truncates while typing and formats to two decimals on blur', () => {
  renderWithProviders(<Post />);

  // Step 1: select category and continue
  fireEvent.click(screen.getByRole('button', { name: /electronics/i }));
  fireEvent.click(screen.getByRole('button', { name: /^continue$/i }));

  // Step 2: continue
  fireEvent.click(screen.getByRole('button', { name: /^continue$/i }));

  const price = screen.getByLabelText(/^price$/i) as HTMLInputElement;
  fireEvent.change(price, { target: { value: '123.4567' } });
  expect(price.value).toBe('123.45');
  fireEvent.blur(price);
  expect(price.value).toBe('123.45');
});


