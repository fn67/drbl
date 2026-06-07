'use client'

import { useState, useEffect, useRef } from 'react'
import { Match } from '@/types'
import { TEAMS, GROUPS } from '@/lib/teams'
import { Flag } from '@/components/flag'
import { computeStatus, formatIST } from '@/lib/utils'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

const STATUS_BADGE = {
  upcoming:    { bg: 'rgba(108,165,240,0.14)', fg: 'oklch(0.82 0.10 230)', label: 'Upcoming' },
  voting_open: { bg: 'rgba(98,200,150,0.16)',  fg: 'oklch(0.85 0.10 164)', label: 'Voting open' },
  locked:      { bg: 'rgba(240,170,80,0.18)',  fg: 'oklch(0.85 0.10 80)',  label: 'Live' },
  completed:   { bg: 'rgba(255,255,255,0.06)', fg: 'rgba(255,255,255,0.62)', label: 'Completed' },
}

const ROUNDS = ['Group Stage', 'Round of 32', 'Round of 16', 'Quarter Final', 'Semi Final', 'Third Place Play-off', 'Final']

const emptyForm = {
  home_team: '', away_team: '',
  kickoff_date: '', kickoff_time: '', round: 'Group Stage', group_name: '',
}

// ── Searchable team dropdown ────────────────────────────────────────────────
function TeamSelect({ value, onChange, exclude, label }: {
  value: string
  onChange: (name: string) => void
  exclude?: string
  label: string
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  useEffect(() => {
    if (open) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 0) }
  }, [open])

  const selected = TEAMS.find(t => t.name === value)
  const filtered = TEAMS.filter(t =>
    t.name !== exclude &&
    t.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 0 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>{label}</label>
      <div ref={ref} style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 8, padding: '9px 12px',
            background: 'var(--background)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 14, color: selected ? 'var(--foreground)' : 'var(--muted-foreground)',
            outline: open ? '2px solid var(--ring)' : 'none', outlineOffset: 2,
            transition: 'border-color .15s',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
            {selected ? (
              <><Flag code={selected.code} size={18} /><span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selected.name}</span></>
            ) : (
              <span>Select team…</span>
            )}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               style={{ flexShrink: 0, opacity: 0.5, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        {open && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 200,
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10,
            boxShadow: '0 12px 32px -8px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '8px 8px 4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 7, border: '1px solid var(--border)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search teams…"
                  style={{
                    background: 'none', border: 'none', outline: 'none',
                    fontSize: 13, fontWeight: 500, color: 'var(--foreground)',
                    fontFamily: 'inherit', width: '100%',
                  }}
                />
              </div>
            </div>
            <div style={{ maxHeight: 220, overflowY: 'auto', padding: '4px 8px 8px' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '10px 8px', fontSize: 13, color: 'var(--muted-foreground)', textAlign: 'center' }}>No teams found</div>
              ) : (
                filtered.map(t => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => { onChange(t.name); setOpen(false) }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 10px', borderRadius: 7,
                      background: t.name === value ? 'rgba(98,200,150,0.12)' : 'transparent',
                      border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      color: 'var(--foreground)', transition: 'background .1s', textAlign: 'left',
                    }}
                    onMouseEnter={e => { if (t.name !== value) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                    onMouseLeave={e => { if (t.name !== value) e.currentTarget.style.background = 'transparent' }}
                  >
                    <Flag code={t.code} size={18} />
                    <span style={{ fontSize: 13.5, fontWeight: 600 }}>{t.name}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', opacity: 0.7 }}>{t.group}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
// ────────────────────────────────────────────────────────────────────────────

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [lockingId, setLockingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const isGroupStage = form.round === 'Group Stage'

  useEffect(() => { document.title = 'DRBL | Admin' }, [])

  useEffect(() => {
    fetch('/api/matches')
      .then(r => r.json())
      .then((data: Match[]) => setMatches([...data].sort((a, b) => new Date(b.kickoff_at).getTime() - new Date(a.kickoff_at).getTime())))
      .catch(() => toast.error('Failed to load matches'))
      .finally(() => setLoading(false))
  }, [])

  const handleDialogChange = (open: boolean) => {
    if (!open) setSaving(false)
    setDialogOpen(open)
  }

  const handleOpen = (match?: Match) => {
    if (match) {
      const dt = new Date(match.kickoff_at)
      const istDt = new Date(dt.getTime() + 330 * 60000)
      setForm({
        home_team: match.home_team, away_team: match.away_team,
        kickoff_date: istDt.toISOString().split('T')[0],
        kickoff_time: istDt.toISOString().split('T')[1].slice(0, 5),
        round: match.round, group_name: match.group_name,
      })
      setEditId(match.id)
    } else {
      setForm(emptyForm)
      setEditId(null)
    }
    setDialogOpen(true)
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const setHomeTeam = (name: string) => {
    const team = TEAMS.find(t => t.name === name)
    setForm(f => ({
      ...f,
      home_team: name,
      // auto-fill group when round is Group Stage and group is not already set
      group_name: f.round === 'Group Stage' && team ? team.group : f.group_name,
    }))
  }

  const setRound = (round: string) => {
    setForm(f => ({
      ...f,
      round,
      group_name: round === 'Group Stage' ? f.group_name : '',
    }))
  }

  const sortDesc = (ms: Match[]) => [...ms].sort((a, b) => new Date(b.kickoff_at).getTime() - new Date(a.kickoff_at).getTime())

  const handleSave = async () => {
    const { home_team, away_team, kickoff_date, kickoff_time, round, group_name } = form
    if (!home_team || !away_team || !kickoff_date || !kickoff_time || !round) {
      toast.error('All fields are required')
      return
    }
    if (home_team === away_team) {
      toast.error('Home and away teams must be different')
      return
    }

    setSaving(true)
    const homeData = TEAMS.find(t => t.name === home_team)!
    const awayData = TEAMS.find(t => t.name === away_team)!
    const kickoff_at = new Date(new Date(`${kickoff_date}T${kickoff_time}:00Z`).getTime() - 330 * 60000).toISOString()
    const payload = {
      home_team, away_team,
      home_flag: homeData.code, away_flag: awayData.code,
      kickoff_at, round,
      group_name: round === 'Group Stage' ? group_name : '',
    }

    if (editId) {
      const res = await fetch('/api/admin/matches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editId, ...payload }),
      })
      if (!res.ok) { toast.error('Failed to update match'); setSaving(false); return }
      const updated = await res.json()
      setMatches(ms => ms.map(m => m.id === editId ? { ...updated, status: computeStatus(updated) } : m))
      toast.success('Match updated')
    } else {
      const res = await fetch('/api/admin/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, status: 'upcoming' }),
      })
      if (!res.ok) { toast.error('Failed to create match'); setSaving(false); return }
      const created = await res.json()
      setMatches(ms => sortDesc([...ms, { ...created, status: computeStatus(created) }]))
      toast.success('Match created')
    }
    setDialogOpen(false)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const res = await fetch('/api/admin/matches', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) { toast.error('Failed to delete match'); setDeletingId(null); return }
    setMatches(ms => ms.filter(m => m.id !== id))
    setDeleteConfirm(null)
    setDeletingId(null)
    toast.success('Match deleted')
  }

  const handleToggleLock = async (id: string) => {
    const match = matches.find(m => m.id === id)!
    const newStatus = match.status === 'locked' ? 'voting_open' : 'locked'
    const manually_locked = newStatus === 'locked'
    setLockingId(id)
    const res = await fetch('/api/admin/matches', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus, manually_locked }),
    })
    setLockingId(null)
    if (!res.ok) { toast.error('Failed to update lock status'); return }
    setMatches(ms => ms.map(m => m.id === id ? { ...m, status: newStatus, manually_locked } : m))
  }

  return (
    <>
      <Toaster />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--foreground)' }}>Match Management</h1>
            <p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 4 }}>Create, edit and manage all matches</p>
          </div>
          <button onClick={() => handleOpen()} style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', fontFamily: 'inherit', fontWeight: 700, fontSize: 14, padding: '10px 18px', borderRadius: 'var(--radius)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Add match
          </button>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'var(--muted-foreground)' }}>Loading matches…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teams</TableHead>
                  <TableHead>Kickoff</TableHead>
                  <TableHead>Round</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((m) => {
                  const badge = STATUS_BADGE[m.status]
                  const kickoff = new Date(m.kickoff_at)
                  return (
                    <TableRow key={m.id}>
                      <TableCell><div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><Flag code={TEAMS.find(t => t.name === m.home_team)?.code ?? 'un'} size={18} />{m.home_team} vs <Flag code={TEAMS.find(t => t.name === m.away_team)?.code ?? 'un'} size={18} />{m.away_team}</div></TableCell>
                      <TableCell style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
                        {kickoff.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })}{' '}
                        {formatIST(m.kickoff_at)}
                      </TableCell>
                      <TableCell style={{ fontSize: 13 }}>{m.group_name ? `${m.group_name} · ` : ''}{m.round}</TableCell>
                      <TableCell>
                        <span style={{ background: badge.bg, color: badge.fg, fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 999, display: 'inline-block' }}>{badge.label}</span>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => handleOpen(m)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--foreground)', cursor: 'pointer', fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 6, fontFamily: 'inherit' }}>Edit</button>
                          <button onClick={() => handleToggleLock(m.id)} disabled={lockingId === m.id} style={{ background: m.status === 'locked' ? 'rgba(240,170,80,0.1)' : 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: lockingId === m.id ? 'var(--muted-foreground)' : m.status === 'locked' ? 'oklch(0.85 0.10 80)' : 'var(--muted-foreground)', cursor: lockingId === m.id ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 6, fontFamily: 'inherit', opacity: lockingId === m.id ? 0.5 : 1 }}>
                            {lockingId === m.id ? 'Loading…' : m.status === 'locked' ? 'Unlock' : 'Lock'}
                          </button>
                          <button onClick={() => setDeleteConfirm(m.id)} style={{ background: 'rgba(255,0,0,0.06)', border: '1px solid rgba(255,0,0,0.15)', color: 'oklch(0.72 0.16 25)', cursor: 'pointer', fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 6, fontFamily: 'inherit' }}>Delete</button>
                          <a href={`/match/${m.id}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--muted-foreground)', cursor: 'pointer', padding: '5px 8px', borderRadius: 6, textDecoration: 'none' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          </a>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {matches.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--muted-foreground)', fontSize: 14 }}>No matches yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent style={{ background: 'var(--card)', border: '1px solid var(--border)', maxWidth: 540 }}>
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit match' : 'Add match'}</DialogTitle>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>

            {/* Team selects side by side */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
              <TeamSelect
                label="Team 1"
                value={form.home_team}
                onChange={setHomeTeam}
                exclude={form.away_team}
              />
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted-foreground)', paddingBottom: 10, flexShrink: 0 }}>vs</div>
              <TeamSelect
                label="Team 2"
                value={form.away_team}
                onChange={v => set('away_team', v)}
                exclude={form.home_team}
              />
            </div>

            {/* Kickoff date + time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { key: 'kickoff_date', label: 'Kickoff date', type: 'date' },
                { key: 'kickoff_time', label: 'Kickoff time (IST)', type: 'time' },
              ].map(({ key, label, type }) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>{label}</label>
                  <Input type={type} value={(form as Record<string, string>)[key]} onChange={e => set(key, e.target.value)} />
                </div>
              ))}
            </div>

            {/* Round */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>Round</label>
              <Select value={form.round} onValueChange={v => v && setRound(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{ROUNDS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            {/* Group — only for Group Stage */}
            {isGroupStage && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>Group</label>
                <Select value={form.group_name} onValueChange={v => v && set('group_name', v)}>
                  <SelectTrigger><SelectValue placeholder="Select group…" /></SelectTrigger>
                  <SelectContent>{GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
              <button onClick={() => handleDialogChange(false)} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--foreground)', cursor: 'pointer', fontSize: 14, fontWeight: 600, padding: '10px 18px', borderRadius: 'var(--radius)', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ background: saving ? 'var(--muted)' : 'var(--primary)', color: saving ? 'var(--muted-foreground)' : 'var(--primary-foreground)', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, padding: '10px 18px', borderRadius: 'var(--radius)', fontFamily: 'inherit' }}>{saving ? 'Saving…' : 'Save match'}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent style={{ background: 'var(--card)', border: '1px solid var(--border)', maxWidth: 400 }}>
          <DialogHeader><DialogTitle>Delete match?</DialogTitle></DialogHeader>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)', marginTop: 8 }}>This action cannot be undone. All predictions for this match will also be deleted.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
            <button onClick={() => setDeleteConfirm(null)} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--foreground)', cursor: 'pointer', fontSize: 14, fontWeight: 600, padding: '10px 18px', borderRadius: 'var(--radius)', fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} disabled={!!deletingId} style={{ background: 'oklch(0.5181 0.1747 25.761)', color: 'white', border: 'none', cursor: deletingId ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, padding: '10px 18px', borderRadius: 'var(--radius)', fontFamily: 'inherit', opacity: deletingId ? 0.6 : 1 }}>{deletingId ? 'Deleting…' : 'Delete'}</button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
