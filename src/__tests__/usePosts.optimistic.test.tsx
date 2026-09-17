import React from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';

jest.mock('../lib/api', () => ({
  postsApi: { create: jest.fn(), getAll: jest.fn() },
}));

// CRA's Jest config runs with resetMocks, which strips implementations given to
// jest.fn() at module scope. Install them per test instead.
beforeEach(() => {
  const { postsApi } = jest.requireMock('../lib/api');
  postsApi.getAll.mockResolvedValue([]);
  postsApi.create.mockImplementation(async (data: any) => ({
    ...data,
    id: 'new-id',
    created_at: new Date().toISOString(),
  }));
});

// One client for the whole test: constructing it inside the wrapper would hand
// every re-render a fresh, empty cache and the assertion would read from it.
const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
}

test('createPost optimistically prepends to posts cache', async () => {
  const { result } = renderHook(() => {
    const r = usePosts();
    const qc = useQueryClient();
    return { ...r, qc } as any;
  }, { wrapper });

  // Seed cache
  act(() => {
    result.current.qc.setQueryData(['posts'], [{ id: 'old', title: 'Old', created_at: '2024-01-01T00:00:00Z' }]);
  });

  await act(async () => {
    await result.current.createPost({
      user_id: 'u1',
      type: 'item',
      title: 'New',
      description: 'desc',
      category: 'Electronics',
      location: 'Loc',
      images: [],
      status: 'active',
      tags: [],
      is_flash_deal: false,
    } as any);
  });

  const after = result.current.qc.getQueryData<any[]>(['posts'])!;
  expect(after[0].title).toBe('New');
});


