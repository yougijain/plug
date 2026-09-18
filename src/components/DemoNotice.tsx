import React, { useState } from 'react'
import { ArrowPathIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { auth } from '../lib/supabase'

/**
 * Slim strip shown only in demo mode. Tells a visitor the data is seeded and
 * gives them a way back to a clean slate after they have posted or messaged.
 */
const DemoNotice: React.FC = () => {
  const [isResetting, setIsResetting] = useState(false)

  const handleReset = () => {
    setIsResetting(true)
    auth.resetDemoData()
    // Full reload so every React Query cache entry refetches from the reset store.
    window.location.assign('/')
  }

  return (
    <div className="bg-[#FFB400] text-[#0E1F33]">
      <div className="flex items-center justify-between gap-2 px-3 py-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <InformationCircleIcon className="h-4 w-4 flex-shrink-0" />
          <p className="text-[11px] font-semibold leading-tight truncate">
            Demo mode — sample listings, nothing leaves your browser
          </p>
        </div>
        <button
          onClick={handleReset}
          disabled={isResetting}
          className="flex items-center gap-1 rounded-md bg-[#0E1F33] px-2 py-1 text-[10px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <ArrowPathIcon className={`h-3 w-3 ${isResetting ? 'animate-spin' : ''}`} />
          Reset
        </button>
      </div>
    </div>
  )
}

export default DemoNotice
