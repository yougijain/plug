import React, { useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useAppStore } from '../lib/store'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

const Profile: React.FC = () => {
  const { currentUser, signOut } = useAuth()
  const [tab, setTab] = useState<'saved' | 'selling' | 'buying'>('saved')
  const { savedPosts } = useAppStore()
  const [showSettings, setShowSettings] = useState(false)
  const [priceAlerts, setPriceAlerts] = useState(true)
  const navigate = useNavigate()
  const stats = useMemo(() => ({
    rating: 4.9,
    sales: 23,
    responseRate: 98,
  }), [])

  return (
    <div className="pb-20 bg-brandOffWhite min-h-screen">
      {/* Header / Hero */}
      <div className="bg-brandNavy px-4 py-5 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <button
              className="h-16 w-16 rounded-full bg-white text-brandNavy flex items-center justify-center font-bold"
              onClick={() => alert('Edit photo coming soon')}
              aria-label="Edit photo"
            >
              {currentUser?.name?.[0] || 'U'}
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-[18px] font-bold">{currentUser?.name || 'Your Profile'}</h1>
                {currentUser?.verified && (
                  <span className="px-2 py-0.5 rounded-full bg-brandMint text-brandNavy text-[12px] font-semibold">Verified</span>
                )}
              </div>
              <p className="text-[13px] font-semibold text-[#D8E1EE]">{currentUser?.university || currentUser?.email}</p>
            </div>
          </div>
          <button onClick={() => setShowSettings(true)} aria-label="Settings">
            <Cog6ToothIcon className="h-6 w-6 text-white" />
          </button>
        </div>
        <div className="mt-2 text-right">
          <button
            onClick={async () => {
              const text = `Check out my Plug profile: ${window.location.origin}/profile`
              if (navigator.share) {
                try { await navigator.share({ title: 'My Plug profile', text, url: window.location.origin + '/profile' }) } catch {}
              } else { alert(text) }
            }}
            className="text-brandYellow text-sm underline"
          >
            Share profile
          </button>
        </div>
      </div>

      {/* Trust strip */}
      <div className="px-4 mt-3 space-y-3">
        <div className="bg-white rounded-full px-3 py-1 inline-flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-brandMint" />
          <span className="text-[12px] font-semibold text-brandNavy">Trusted Seller</span>
        </div>
        <div>
          <div className="h-1.5 w-full bg-[#E6E9EE] rounded-full overflow-hidden">
            <div className="h-1.5 bg-brandMint rounded-full" style={{ width: '60%' }} />
          </div>
          <p className="text-[12px] text-dark-500 mt-1">Complete phone verification to reach the next badge</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg border border-neutral-200 p-3 text-center">
            <p className="text-[18px] font-bold text-brandNavy">{stats.rating}⭐</p>
            <p className="text-[12px] font-semibold text-dark-500">Rating</p>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 text-center">
            <p className="text-[18px] font-bold text-brandNavy">{stats.sales}</p>
            <p className="text-[12px] font-semibold text-dark-500">Sales</p>
          </div>
          <div className="bg-white rounded-lg border border-neutral-200 p-3 text-center">
            <p className="text-[18px] font-bold text-brandNavy">{stats.responseRate}%</p>
            <p className="text-[12px] font-medium text-dark-500">Reply rate • Avg reply 12m</p>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex bg-[#E6E9EE] rounded-lg p-1 mt-3">
          {(['saved','selling','buying'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 h-9 rounded-md text-[14px] font-bold ${tab === t ? 'bg-[#FFEEE6] text-brandOrange' : 'text-brandNavy'}`}
            >
              {t === 'saved' ? `Saved (${savedPosts.length})` : t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4 text-dark-600">
          {tab === 'saved' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-brandNavy font-semibold text-[16px]">Saved</h2>
                <label className="flex items-center space-x-2 text-[12px] text-dark-600">
                  <span>Price-drop alerts</span>
                  <input type="checkbox" className="h-4 w-4" checked={priceAlerts} onChange={(e) => setPriceAlerts(e.target.checked)} />
                </label>
              </div>
              {savedPosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[16px] font-bold text-brandNavy">Nothing saved yet 👀</p>
                  <p className="text-[14px] text-dark-600">Tap ♥ on listings. We’ll alert you on price drops & when items hit Live.</p>
                  <div className="flex items-center justify-center space-x-2 mt-4">
                    <button onClick={() => navigate('/live')} className="px-4 py-2 rounded-full bg-brandOrange text-white text-[14px] font-semibold">Find deals</button>
                    <button onClick={() => navigate('/post')} className="px-4 py-2 rounded-full border border-neutral-300 text-brandNavy text-[14px] font-semibold">Post something</button>
                  </div>
                </div>
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
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-brandNavy font-semibold text-[16px]">Selling</h2>
                <div className="flex items-center space-x-2">
                  <button onClick={() => navigate('/post')} className="h-8 px-3 rounded-md bg-brandOrange text-white text-sm font-semibold">Add listing</button>
                  <button className="h-8 w-8 rounded-md border border-neutral-300 text-brandNavy">≡</button>
                </div>
              </div>
              <div className="bg-white border border-neutral-200 rounded-lg p-3 text-dark-600">
                <p className="text-sm">Your listings for sale. Boost to Live to sell faster 🔥</p>
                <div className="mt-3 flex items-center space-x-2">
                  <button onClick={() => alert('Bumped')} className="px-3 py-1.5 rounded-full border border-brandOrange text-brandOrange text-sm font-semibold">Bump</button>
                  <button onClick={() => alert('Dropped 10%')} className="px-3 py-1.5 rounded-full border border-brandOrange text-brandOrange text-sm font-semibold">Lower 10%</button>
                  <button onClick={() => alert('Marked as sold ✅')} className="px-3 py-1.5 rounded-full border border-neutral-300 text-brandNavy text-sm">Mark sold</button>
                </div>
              </div>
            </div>
          )}
          {tab === 'buying' && (
            <div>
              <h2 className="text-brandNavy font-semibold text-[16px] mb-2">Buying</h2>
              <p className="text-sm">Your messages and offers tied to items you’re chasing.</p>
            </div>
          )}
        </div>
      </div>

      {/* Settings Sheet */}
      {showSettings && (
        <div className="fixed inset-0 z-20">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSettings(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 shadow-2xl">
            <p className="text-brandNavy font-semibold mb-3">Settings</p>
            <button onClick={() => alert('Edit bio coming soon')} className="w-full text-left py-2 text-dark-700">Edit bio</button>
            <button onClick={() => alert('Manage notifications coming soon')} className="w-full text-left py-2 text-dark-700">Notifications</button>
            <button onClick={() => { setShowSettings(false); signOut() }} className="w-full text-left py-2 text-brandOrange font-semibold">Sign out</button>
            <div className="mt-3 text-right">
              <button onClick={() => setShowSettings(false)} className="px-4 py-2 rounded-lg bg-brandOrange text-white text-sm font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile


