import React from 'react'
import { isDemoMode } from '../lib/env'

const FEATURES = [
  'Campus-scoped feed with search and category filters',
  'Flash deals that expire, on a separate Live tab',
  'Three-step listing composer with image upload',
  'Buyer/seller threads per listing',
  'Saved items and a checkout-style cart',
]

/**
 * Context panel rendered beside the app on large screens. The product itself is
 * mobile-first, so on a laptop the bare phone column needs framing: what this
 * is, what it is built with, and that the data is a demo dataset.
 */
const DesktopFrame: React.FC = () => (
  <aside className="hidden lg:flex sticky top-0 h-screen flex-col justify-center justify-self-end w-[368px] xl:w-[420px] pr-10">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF6B35]">
      Campus marketplace
    </p>
    <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[#0E1F33]">
      Plug into campus life.
    </h1>
    <p className="mt-4 text-[15px] leading-relaxed text-[#4A5A6D]">
      A mobile-first marketplace for verified students: buy and sell textbooks, tickets,
      furniture and rides with people on your own campus instead of strangers on Marketplace.
    </p>

    <ul className="mt-7 space-y-2.5">
      {FEATURES.map((feature) => (
        <li key={feature} className="flex items-start gap-2.5 text-sm text-[#2F3E50]">
          <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#FF6B35]" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>

    <div className="mt-8 flex flex-wrap gap-2">
      {['React 18', 'TypeScript', 'React Router', 'React Query', 'Zustand', 'Tailwind', 'Supabase'].map(
        (tech) => (
          <span
            key={tech}
            className="rounded-full border border-[#D8DEE7] bg-white px-2.5 py-1 text-[11px] font-medium text-[#3A4A5C]"
          >
            {tech}
          </span>
        )
      )}
    </div>

    {isDemoMode && (
      <p className="mt-8 max-w-sm text-xs leading-relaxed text-[#6B7A8C]">
        Running on the built-in demo backend — a seeded dataset that lives in your browser, so
        the whole app is explorable without an account. Point it at a Supabase project and the
        same screens run on Postgres.
      </p>
    )}
  </aside>
)

export default DesktopFrame
