'use client'

import { useState } from 'react'
import { MOCK_MATCHES } from '@/lib/mock-data'
import { Match } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

const STATUS_BADGE = {
  upcoming:    { bg: 'rgba(108, 165, 240, 0.14)', fg: 'oklch(0.82 0.10 230)', label: 'Upcoming' },
  voting_open: { bg: 'rgba(98, 200, 150, 0.16)',  fg: 'oklch(0.85 0.10 164)', label: 'Voting open' },
  locked:      { bg: 'rgba(240, 170, 80, 0.18)',  fg: 'oklch(0.85 0.10 80)',  label: 'Live' },
  completed:   { bg: 'rgba(255, 255, 255, 0.06)', fg: 'rgba(255,255,255,0.62)', label: 'Completed' },
}

const ROUNDS = ['Group Stage', 'Round of 16', 'Quarter Final', 'Semi Final', 'Final']

const emptyForm = {
  home_team: '', away_team: '',
  home_flag: '', away_flag: '',
  kickoff_date: '', kickoff_time: '',
  round: 'Group Stage', group_name: '',
}

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const handleOpen = (match?: Match) => {
    if (match) {
      const dt = new Date(match.kickoff_at)
      setForm({
        home_team: match.home_team,
        away_team: match.away_team,
        home_flag: match.home_flag,
        away_flag: match.away_flag,
        kickoff_date: dt.toISOString().split('T')[0],
        kickoff_time: dt.toISOString().split('T')[1].slice(0, 5),
        round: match.round,
        group_name: match.group_name,
      })
      setEditId(match.id)
    } else {
      setForm(emptyForm)
      setEditId(null)
    }
    setDialogOpen(true)
  }

  const handleSave = () => {
    const { home_team, away_team, home_flag, away_flag, kickoff_date, kickoff_time, round, group_name } = form
    if (!home_team || !away_team || !home_flag || !away_flag || !kickoff_date || !kickoff_time || !round) {
      toast.error('All fields are required')
      return
    }
    const kickoff_at = `${kickoff_date}T${kickoff_time}:00Z`
    if (editId) {
      setMatches(ms => ms.map(m => m.id === editId
        ? { ...m, home_team, away_team, home_flag, away_flag, kickoff_at, round, group_name }
        : m
      ))
      toast.success('Match updated')
    } else {
      const newMatch: Match = {
        id: String(Date.now()),
        home_team, away_team, home_flag, away_flag,
        kickoff_at, round, group_name,
        status: 'upcoming',
        home_score: null, away_score: null,
        created_at: new Date().toISOString(),
      }
      setMatches(ms => [...ms, newMatch])
      toast.success('Match created')
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setMatches(ms => ms.filter(m => m.id !== id))
    setDeleteConfirm(null)
    toast.success('Match deleted')
  }

  const handleToggleLock = (id: string) => {
    setMatches(ms => ms.map(m => {
      if (m.id !== id) return m
      const newStatus = m.status === 'locked' ? 'voting_open' : 'locked'
      return { ...m, status: newStatus }
    }))
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <>
      <Toaster />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--foreground)' }}>Match Management</h1>
            <p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 4 }}>
              Create, edit and manage all matches
            </p>
          </div>
          <button onClick={() => handleOpen()} style={{
            background: 'var(--primary)', color: 'var(--primary-foreground)',
            border: 'none', fontFamily: 'inherit', fontWeight: 700, fontSize: 14,
            padding: '10px 18px', borderRadius: 'var(--radius)',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add match
          </button>
        </div>

        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', overflow: 'hidden',
        }}>
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
                    <TableCell>
                      <div style={{ fontWeight: 600 }}>
                        {m.home_flag} {m.home_team} vs {m.away_flag} {m.away_team}
                      </div>
                    </TableCell>
                    <TableCell style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>
                      {kickoff.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })}{' '}
                      {kickoff.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                    </TableCell>
                    <TableCell style={{ fontSize: 13 }}>
                      {m.group_name ? `${m.group_name} · ` : ''}{m.round}
                    </TableCell>
                    <TableCell>
                      <span style={{
                        background: badge.bg, color: badge.fg,
                        fontSize: 12, fontWeight: 600,
                        padding: '4px 10px', borderRadius: 999,
                        display: 'inline-block',
                      }}>{badge.label}</span>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleOpen(m)} style={{
                          background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                          color: 'var(--foreground)', cursor: 'pointer',
                          fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 6,
                          fontFamily: 'inherit',
                        }}>Edit</button>
                        <button onClick={() => handleToggleLock(m.id)} style={{
                          background: m.status === 'locked' ? 'rgba(240,170,80,0.1)' : 'rgba(255,255,255,0.04)',
                          border: '1px solid var(--border)',
                          color: m.status === 'locked' ? 'oklch(0.85 0.10 80)' : 'var(--muted-foreground)',
                          cursor: 'pointer',
                          fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 6,
                          fontFamily: 'inherit',
                        }}>{m.status === 'locked' ? 'Unlock' : 'Lock'}</button>
                        <button onClick={() => setDeleteConfirm(m.id)} style={{
                          background: 'rgba(255,0,0,0.06)', border: '1px solid rgba(255,0,0,0.15)',
                          color: 'oklch(0.72 0.16 25)', cursor: 'pointer',
                          fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 6,
                          fontFamily: 'inherit',
                        }}>Delete</button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent style={{ background: 'var(--card)', border: '1px solid var(--border)', maxWidth: 520 }}>
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit match' : 'Add match'}</DialogTitle>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>Home team</label>
                <Input value={form.home_team} onChange={e => set('home_team', e.target.value)} placeholder="Brazil" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>Home flag emoji</label>
                <Input value={form.home_flag} onChange={e => set('home_flag', e.target.value)} placeholder="🇧🇷" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>Away team</label>
                <Input value={form.away_team} onChange={e => set('away_team', e.target.value)} placeholder="Argentina" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>Away flag emoji</label>
                <Input value={form.away_flag} onChange={e => set('away_flag', e.target.value)} placeholder="🇦🇷" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>Kickoff date</label>
                <Input type="date" value={form.kickoff_date} onChange={e => set('kickoff_date', e.target.value)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>Kickoff time (UTC)</label>
                <Input type="time" value={form.kickoff_time} onChange={e => set('kickoff_time', e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>Round</label>
              <Select value={form.round} onValueChange={(v) => v && set('round', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROUNDS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>Group name (leave empty for knockouts)</label>
              <Input value={form.group_name} onChange={e => set('group_name', e.target.value)} placeholder="Group A" />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
              <button onClick={() => setDialogOpen(false)} style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--foreground)', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, padding: '10px 18px', borderRadius: 'var(--radius)',
                fontFamily: 'inherit',
              }}>Cancel</button>
              <button onClick={handleSave} style={{
                background: 'var(--primary)', color: 'var(--primary-foreground)',
                border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, padding: '10px 18px', borderRadius: 'var(--radius)',
                fontFamily: 'inherit',
              }}>Save match</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent style={{ background: 'var(--card)', border: '1px solid var(--border)', maxWidth: 400 }}>
          <DialogHeader>
            <DialogTitle>Delete match?</DialogTitle>
          </DialogHeader>
          <p style={{ fontSize: 14, color: 'var(--muted-foreground)', marginTop: 8 }}>
            This action cannot be undone. All predictions for this match will also be deleted.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
            <button onClick={() => setDeleteConfirm(null)} style={{
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--foreground)', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, padding: '10px 18px', borderRadius: 'var(--radius)',
              fontFamily: 'inherit',
            }}>Cancel</button>
            <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} style={{
              background: 'oklch(0.5181 0.1747 25.761)', color: 'white',
              border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, padding: '10px 18px', borderRadius: 'var(--radius)',
              fontFamily: 'inherit',
            }}>Delete</button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
