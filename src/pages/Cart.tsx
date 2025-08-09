import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../lib/store'

const Cart: React.FC = () => {
  const navigate = useNavigate()
  const { cart, savedPosts, removeFromCart, clearCart } = useAppStore()

  const subtotal = cart.reduce((sum, p) => sum + (typeof p.price === 'number' ? p.price : 0), 0)

  const handleCheckout = async () => {
    // Placeholder for Stripe checkout integration
    alert('Stripe checkout coming soon. Subtotal: $' + subtotal.toFixed(2))
  }

  return (
    <div className="min-h-screen bg-brandOffWhite">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center space-x-3">
        <button onClick={() => navigate(-1)} className="text-brandNavy">← Back</button>
        <h1 className="text-lg font-semibold text-brandNavy">Cart</h1>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-lg p-4 text-dark-600">
            Your cart is empty.
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((p) => (
              <div key={p.id} className="bg-white border border-neutral-200 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-brandNavy">{p.title}</p>
                  <p className="text-xs text-dark-500">{p.category} · {p.location}</p>
                </div>
                <div className="flex items-center space-x-3">
                  {p.price && <span className="text-brandOrange font-semibold">${p.price}</span>}
                  <button onClick={() => removeFromCart(p.id)} className="text-sm text-dark-500 hover:text-brandNavy">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary / Checkout */}
      <div className="p-4 space-y-3">
        <div className="bg-white border border-neutral-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-dark-700">Subtotal</span>
          <span className="text-brandNavy font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleCheckout} disabled={cart.length === 0} className="flex-1 bg-brandOrange text-white py-2 rounded-lg font-medium disabled:opacity-50">Checkout</button>
          <button onClick={clearCart} disabled={cart.length === 0} className="flex-1 bg-white border border-neutral-300 text-brandNavy py-2 rounded-lg font-medium disabled:opacity-50">Clear</button>
        </div>
      </div>

      {/* Saved Items */}
      <div className="p-4">
        <h2 className="text-brandNavy font-semibold mb-2">Saved Items</h2>
        {savedPosts.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-lg p-4 text-dark-600">
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
                {p.price && <span className="text-brandOrange font-semibold">${p.price}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart


