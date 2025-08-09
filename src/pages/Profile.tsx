import React, { useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useAppStore } from '../lib/store'

const Profile: React.FC = () => {
  const { currentUser, signOut } = useAuth()
  const [tab, setTab] = useState<'saved' | 'selling' | 'buying'>('saved')
  const { savedPosts } = useAppStore()
  const stats = useMemo(() => ({
    rating: 4.9,
    sales: 23,
    responseRate: 98,
  }), [])

  return (
    <div className="pb-20">
      <div className="bg-brandNavy px-4 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-white text-brandNavy flex items-center justify-center font-bold">
              {currentUser?.name?.[0] || 'U'}
            </div>
            <div>
              <h1 className="text-xl font-bold">{currentUser?.name || 'Your Profile'}</h1>
              <p className="text-sm opacity-80">{currentUser?.university || currentUser?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {currentUser?.verified && (
              <span className="px-2 py-1 rounded-full bg-brandMint text-brandNavy text-xs font-semibold">Verified</span>
            )}
            <button onClick={() => signOut()} className="px-3 py-1 rounded-lg bg-white text-brandNavy text-sm font-medium">Sign out</button>
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        {/* Sticky value props */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-white rounded-lg border border-neutral-200 p-3 text-center">
            <p className="text-xs text-dark-500">Rating</p>
            <p className="text-lg font-semibold text-brandNavy">{stats.rating}⭐</p>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 text-center">
            <p className="text-xs text-dark-500">Sales</p>
            <p className="text-lg font-semibold text-brandNavy">{stats.sales}</p>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 text-center">
            <p className="text-xs text-dark-500">Response</p>
            <p className="text-lg font-semibold text-brandNavy">{stats.responseRate}%</p>
          </div>
        </div>
        <div className="flex bg-brandOffWhite rounded-lg p-1">
          {(['saved','selling','buying'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-md text-sm font-medium ${tab === t ? 'bg-white shadow text-brandNavy' : 'text-dark-600'}`}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4 text-dark-600">
          {tab === 'saved' && (
            <div>
              <h2 className="text-brandNavy font-semibold mb-2">Saved</h2>
              {savedPosts.length === 0 ? (
                <p className="text-sm">Items you’ve bookmarked appear here. We’ll notify you on price drops 💸</p>
              ) : (
                <div className="space-y-3">
                  {savedPosts.map((p) => (
                    <div key={p.id} className="border border-neutral-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-brandNavy">{p.title}</p>
                          <p className="text-xs text-dark-500">{p.category} · {p.location}</p>
                        </div>
                        {p.price && <span className="text-brandOrange font-semibold">${p.price}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {tab === 'selling' && (
            <div>
              <h2 className="text-brandNavy font-semibold mb-2">Selling</h2>
              <p className="text-sm">Your listings for sale. Boost to Live to sell faster 🔥</p>
            </div>
          )}
          {tab === 'buying' && (
            <div>
              <h2 className="text-brandNavy font-semibold mb-2">Buying</h2>
              <p className="text-sm">Your messages and offers tied to items you’re chasing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile


