import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../lib/store'

const Saved: React.FC = () => {
  const navigate = useNavigate()
  const { savedPosts, removeSavedPost, addToCart } = useAppStore()

  return (
    <div className="min-h-screen bg-brandOffWhite">
      <div className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center space-x-3">
        <button onClick={() => navigate(-1)} className="text-brandNavy">← Back</button>
        <h1 className="text-lg font-semibold text-brandNavy">Saved</h1>
      </div>

      <div className="p-4 space-y-3">
        {savedPosts.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-lg p-4 text-dark-600 text-center">
            No saved items yet.
          </div>
        ) : (
          <div className="space-y-3">
            {savedPosts.map((p) => (
              <div key={p.id} className="bg-white border border-neutral-200 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-brandNavy">{p.title}</p>
                  <p className="text-xs text-dark-500">{p.category} · {p.location}</p>
                </div>
                <div className="flex items-center space-x-3">
                  {p.price && <span className="text-brandOrange font-semibold">${p.price}</span>}
                  <button onClick={() => addToCart(p)} className="text-sm text-brandNavy hover:underline">Add to cart</button>
                  <button onClick={() => removeSavedPost(p.id)} className="text-sm text-dark-500 hover:text-brandNavy">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Saved


