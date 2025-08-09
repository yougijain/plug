import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePosts } from '../hooks/usePosts'

const Post: React.FC = () => {
  const { currentUser } = useAuth()
  const { createPost, isCreatingPost } = usePosts()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [form, setForm] = useState({
    type: 'item' as 'item' | 'service' | 'ride' | 'ticket' | 'book' | 'sublet',
    category: '',
    images: [] as string[],
    title: '',
    description: '',
    price: '',
    location: '',
    is_flash_deal: false,
  })

  const next = () => setStep((s) => (s === 3 ? s : ((s + 1) as any)))
  const back = () => setStep((s) => (s === 1 ? s : ((s - 1) as any)))

  const submit = async () => {
    if (!currentUser?.id) return
    await createPost({
      user_id: currentUser.id,
      type: form.type,
      title: form.title.trim(),
      description: form.description.trim(),
      price: form.price ? parseFloat(form.price) : undefined,
      category: form.category,
      location: form.location,
      images: form.images,
      status: 'active',
      tags: [],
      is_flash_deal: form.is_flash_deal,
      flash_deal_expires_at: undefined,
      expires_at: undefined,
    })
    alert('Posted!')
  }

  return (
    <div className="pb-20">
      <div className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
        <button onClick={back} className="text-dark-600">{step > 1 ? 'Back' : ''}</button>
        <h1 className="text-lg font-semibold">Create a Post</h1>
        <div />
      </div>

      <div className="p-4">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-medium">Select Category</h2>
            <select
              className="w-full border border-neutral-300 rounded-lg px-3 py-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Choose…</option>
              <option>Electronics</option>
              <option>Books</option>
              <option>Furniture</option>
              <option>Clothing</option>
              <option>Sports</option>
              <option>Other</option>
            </select>
            <button onClick={next} disabled={!form.category} className="w-full bg-brandOrange text-white rounded-lg py-2">Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-medium">Add Photos</h2>
            <div className="p-4 border border-dashed border-neutral-300 rounded-lg text-center text-dark-500">
              Photo upload placeholder (storage to be wired)
            </div>
            <button onClick={next} className="w-full bg-brandOrange text-white rounded-lg py-2">Next</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-medium">Details</h2>
            <input className="w-full border border-neutral-300 rounded-lg px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea className="w-full border border-neutral-300 rounded-lg px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input className="w-full border border-neutral-300 rounded-lg px-3 py-2" placeholder="Price (optional)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input className="w-full border border-neutral-300 rounded-lg px-3 py-2" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" checked={form.is_flash_deal} onChange={(e) => setForm({ ...form, is_flash_deal: e.target.checked })} />
              <span>Show in Live Now</span>
            </label>
            <button onClick={submit} disabled={isCreatingPost || !form.title || !form.description || !form.location} className="w-full bg-brandOrange text-white rounded-lg py-2">{isCreatingPost ? 'Posting…' : 'Post'}</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Post


