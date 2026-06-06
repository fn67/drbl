'use client'

import { useState, useEffect } from 'react'
import { LeaderboardEntry } from '@/types'
import { LeaderboardList } from './leaderboard-list'

const PAGE_SIZE = 50

interface Props {
  initialEntries: LeaderboardEntry[]
  totalCount: number
  currentUserId: string
}

export function LeaderboardClient({ initialEntries, totalCount, currentUserId }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(initialEntries)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [offset, setOffset] = useState(initialEntries.length)
  const [total, setTotal] = useState(totalCount)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    if (debouncedSearch === '') {
      setEntries(initialEntries)
      setOffset(initialEntries.length)
      setTotal(totalCount)
      return
    }
    setSearching(true)
    fetch(`/api/leaderboard?search=${encodeURIComponent(debouncedSearch)}`)
      .then(r => r.json())
      .then(({ entries: res, total: t }: { entries: LeaderboardEntry[]; total: number }) => {
        setEntries(res)
        setTotal(t)
      })
      .finally(() => setSearching(false))
  }, [debouncedSearch, initialEntries, totalCount])

  async function loadMore() {
    setLoadingMore(true)
    const res = await fetch(`/api/leaderboard?offset=${offset}`)
    const { entries: more, total: t }: { entries: LeaderboardEntry[]; total: number } = await res.json()
    setEntries(prev => [...prev, ...more])
    setOffset(prev => prev + more.length)
    setTotal(t)
    setLoadingMore(false)
  }

  const isSearchActive = search.trim() !== ''
  const hasMore = !isSearchActive && entries.length < total

  return (
    <div>
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
             style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search users…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '9px 36px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--foreground)', fontSize: 13.5, fontFamily: 'inherit',
            outline: 'none',
          }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            aria-label="Clear search"
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--muted-foreground)', fontSize: 18, lineHeight: 1,
              padding: '2px 6px', display: 'flex', alignItems: 'center',
            }}
          >×</button>
        )}
      </div>

      {searching ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted-foreground)', fontSize: 13.5 }}>
          Searching…
        </div>
      ) : entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--muted-foreground)' }}>No users found</p>
          {isSearchActive && (
            <p style={{ fontSize: 12.5, color: 'var(--muted-foreground)', marginTop: 4, opacity: 0.7 }}>
              Try a different name
            </p>
          )}
        </div>
      ) : (
        <LeaderboardList entries={entries} currentUserId={currentUserId} isFiltered={isSearchActive} />
      )}

      {hasMore && (
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={loadMore}
            disabled={loadingMore}
            style={{
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              padding: '8px 24px', borderRadius: 999,
              border: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.04)',
              color: loadingMore ? 'var(--muted-foreground)' : 'var(--foreground)',
              cursor: loadingMore ? 'default' : 'pointer',
            }}
          >
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  )
}
