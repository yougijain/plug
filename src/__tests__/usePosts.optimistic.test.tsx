import React from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';

jest.mock('../lib/api', () => ({
  postsApi: {
    create: jest.fn(async (data) => ({ ...data, id: 'new-id', created_at: new Date().toISOString() })),
    getAll: jest.fn(async () => []),
  },
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient();
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


