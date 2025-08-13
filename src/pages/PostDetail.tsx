import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePost } from '../hooks/usePosts'
import CategoryPlaceholder from '../components/CategoryPlaceholder'
import { AnimatePresence, motion } from 'framer-motion'

const PostDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { post, isLoading, error } = usePost(id || '')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchDeltaX, setTouchDeltaX] = useState(0)

  // Derive images safely so hooks below are unconditional
  const images: string[] = Array.isArray(post?.images) ? (post?.images as string[]) : []

  const openLightbox = (startIndex = 0) => {
    if (images.length === 0) return
    setCurrentIndex(startIndex)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)

  const goNext = useCallback(() => {
    if (images.length <= 1) return
    setCurrentIndex((i) => (i + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    if (images.length <= 1) return
    setCurrentIndex((i) => (i - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, goNext, goPrev])

  // Early returns AFTER hooks are declared to satisfy rules-of-hooks
  if (isLoading) {
    return <div className="p-4">Loading…</div>
  }
  if (error || !post) {
    return <div className="p-4">Post not found.</div>
  }

  const onTouchStart: React.TouchEventHandler = (e) => {
    setTouchStartX(e.touches[0].clientX)
    setTouchDeltaX(0)
  }
  const onTouchMove: React.TouchEventHandler = (e) => {
    if (touchStartX == null) return
    setTouchDeltaX(e.touches[0].clientX - touchStartX)
  }
  const onTouchEnd: React.TouchEventHandler = () => {
    const threshold = 50
    if (touchDeltaX > threshold) {
      goPrev()
    } else if (touchDeltaX < -threshold) {
      goNext()
    }
    setTouchStartX(null)
    setTouchDeltaX(0)
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="bg-white border-b border-[#E6E9EE] px-4 py-4">
        <button onClick={() => navigate(-1)} className="text-sm text-[#0E1F33]">Back</button>
      </div>
      <div className="p-4">
        <div className="bg-white rounded-xl shadow border border-[#ECECEC] p-4">
          <div className="mb-4">
            {images.length > 0 ? (
              <div>
                <img
                  src={images[0]}
                  alt={post.title}
                  className="w-full h-56 object-cover rounded-lg cursor-pointer"
                  onClick={() => openLightbox(0)}
                />
                {images.length > 1 && (
                  <div className="mt-2 flex items-center space-x-2 overflow-x-auto">
                    {images.map((src, idx) => (
                      <button key={idx} onClick={() => openLightbox(idx)} className={`h-14 w-14 flex-shrink-0 rounded-md overflow-hidden border ${idx===0 ? 'border-[#FF6B35]' : 'border-[#E6E9EE]'}`}>
                        <img src={src} alt={`thumb-${idx}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center"><CategoryPlaceholder category={post.category || post.type} size={96} /></div>
            )}
          </div>
          <h1 className="text-xl font-bold text-[#0E1F33] mb-1">{post.title}</h1>
          <p className="text-[#6F7A85] mb-4">{post.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-[#FF6B35]">{post.price ? `$${post.price}` : 'Free'}</span>
            {post.expires_at && (
              <span className="text-xs text-gray-500">Expires {new Date(post.expires_at).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <div className="absolute inset-0" />
            <div
              className="relative max-w-md w-full px-4"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="relative">
                <img src={images[currentIndex]} alt={`image-${currentIndex}`} className="w-full h-96 object-contain rounded-lg bg-black" />
                {images.length > 1 && (
                  <div className="absolute inset-x-0 -bottom-8 flex items-center justify-center space-x-1">
                    {images.map((_, i) => (
                      <span key={i} className={`h-1.5 w-4 rounded-full ${i===currentIndex ? 'bg-white' : 'bg-white/40'}`} />
                    ))}
                  </div>
                )}
                {/* Controls */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full h-10 w-10 flex items-center justify-center"
                      aria-label="Previous"
                    >
                      ‹
                    </button>
                    <button
                      onClick={goNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full h-10 w-10 flex items-center justify-center"
                      aria-label="Next"
                    >
                      ›
                    </button>
                  </>
                )}
                <button
                  onClick={closeLightbox}
                  className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 text-white rounded-full h-8 w-8 flex items-center justify-center"
                  aria-label="Close"
                >
                  ✕
                </button>
                <div className="absolute top-2 left-2 text-white text-xs bg-black/40 px-2 py-0.5 rounded">
                  {currentIndex + 1} / {images.length}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PostDetail


