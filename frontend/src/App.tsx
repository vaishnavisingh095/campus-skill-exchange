import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  ArrowDownLeft, ArrowRight, ArrowUpRight, Bell, BookOpen, CalendarDays,
  Check, ChevronDown, CircleAlert, Clock3, GraduationCap, Inbox, LayoutDashboard,
  LoaderCircle, Menu, Plus, Repeat2, Search, Send, Sparkles, Trash2, UsersRound, Wifi,
} from 'lucide-react'
import { supabase } from './lib/supabase'
import { demoSnapshot } from './demo-data'
import './App.css'

type Student = {
  student_id: number; full_name: string; email: string; department: string
  year_of_study: number; section: string | null; bio: string | null; account_status: string
}
type Skill = { skill_id: number; category_id: number; skill_name: string; description: string | null }
type Category = { category_id: number; category_name: string }
type TeachingSkill = { student_skill_id: number; student_id: number; skill_id: number; proficiency_level: string; experience_years: number }
type WantedSkill = { wanted_skill_id: number; student_id: number; skill_id: number; target_level: string; priority: number; learning_goal: string | null }
type Request = { request_id: number; sender_id: number; receiver_id: number; offered_skill_id: number; requested_skill_id: number; request_message: string | null; requested_at: string; status: string }
type Exchange = { exchange_id: number; request_id: number; student_one_id: number; student_two_id: number; skill_one_id: number; skill_two_id: number; start_date: string; end_date: string | null; exchange_status: string }
type Session = { session_id: number; exchange_id: number; mentor_id: number; learner_id: number; skill_id: number; session_date: string; duration_minutes: number; topic: string; meeting_mode: string; session_status: string }
type Review = { review_id: number; reviewed_student_id: number; rating: number }
type Notice = { notification_id: number; student_id: number; title: string; message: string; is_read: boolean; created_at: string }
type Page = 'Overview' | 'Discover' | 'Requests' | 'Exchanges' | 'Sessions' | 'My profile'

const navItems: { label: Page; icon: typeof LayoutDashboard }[] = [
  { label: 'Overview', icon: LayoutDashboard }, { label: 'Discover', icon: UsersRound },
  { label: 'Requests', icon: Inbox }, { label: 'Exchanges', icon: Repeat2 },
  { label: 'Sessions', icon: CalendarDays }, { label: 'My profile', icon: GraduationCap },
]

function App() {
  const [page, setPage] = useState<Page>('Overview')
  const [mobileNav, setMobileNav] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [teaching, setTeaching] = useState<TeachingSkill[]>([])
  const [wanted, setWanted] = useState<WantedSkill[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [notices, setNotices] = useState<Notice[]>([])
  const [studentId, setStudentId] = useState<number>(() => Number(localStorage.getItem('campus-demo-student')) || 0)
  const [search, setSearch] = useState('')
  const [showSchedule, setShowSchedule] = useState(false)

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3600) }

  const loadData = useCallback(async () => {
    if (!supabase) {
      setLoadError('Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env.local, then restart the app.')
      setStudents(demoSnapshot.students)
      setSkills(demoSnapshot.skills)
      setCategories(demoSnapshot.categories)
      setTeaching(demoSnapshot.teaching)
      setWanted(demoSnapshot.wanted)
      setRequests(demoSnapshot.requests)
      setExchanges(demoSnapshot.exchanges)
      setSessions(demoSnapshot.sessions)
      setReviews(demoSnapshot.reviews)
      setNotices(demoSnapshot.notices)
      const savedId = Number(localStorage.getItem('campus-demo-student')) || 0
      const profileId = demoSnapshot.students.some((student) => student.student_id === savedId) ? savedId : 1
      setStudentId(profileId)
      localStorage.setItem('campus-demo-student', String(profileId))
      setLoading(false)
      return
    }
    setLoading(true)
    setLoadError('')
    const showDemoFallback = (message: string) => {
      setLoadError(`${message}. Showing a read-only sample preview. Confirm that the schema and seed SQL have run and the tables are accessible to the anon role.`)
      setStudents(demoSnapshot.students)
      setSkills(demoSnapshot.skills)
      setCategories(demoSnapshot.categories)
      setTeaching(demoSnapshot.teaching)
      setWanted(demoSnapshot.wanted)
      setRequests(demoSnapshot.requests)
      setExchanges(demoSnapshot.exchanges)
      setSessions(demoSnapshot.sessions)
      setReviews(demoSnapshot.reviews)
      setNotices(demoSnapshot.notices)
      const savedId = Number(localStorage.getItem('campus-demo-student')) || 0
      const profileId = demoSnapshot.students.some((student) => student.student_id === savedId) ? savedId : 1
      setStudentId(profileId)
      localStorage.setItem('campus-demo-student', String(profileId))
      setLoading(false)
    }
    try {
      const timeout = new Promise<never>((_, reject) => {
        window.setTimeout(() => reject(new Error('Supabase did not respond in time')), 8000)
      })
      const results = await Promise.race([
        Promise.all([
          supabase.from('students').select('*').order('full_name'),
          supabase.from('skills').select('*').order('skill_name'),
          supabase.from('skill_categories').select('*').order('category_name'),
          supabase.from('student_skills').select('*'),
          supabase.from('wanted_skills').select('*'),
          supabase.from('exchange_requests').select('*').order('requested_at', { ascending: false }),
          supabase.from('skill_exchanges').select('*').order('start_date', { ascending: false }),
          supabase.from('sessions').select('*').order('session_date', { ascending: true }),
          supabase.from('reviews').select('*'),
          supabase.from('notifications').select('*').order('created_at', { ascending: false }),
        ]),
        timeout,
      ])
      const failed = results.find((result) => result.error)
      if (failed?.error) {
        showDemoFallback(failed.error.message)
        return
      }
    const studentRows = (results[0].data ?? []) as Student[]
    if (studentRows.length === 0) {
      showDemoFallback('The new Supabase project is connected, but no student records have been seeded yet')
      return
    }
    setStudents(studentRows)
    setSkills((results[1].data ?? []) as Skill[])
    setCategories((results[2].data ?? []) as Category[])
    setTeaching((results[3].data ?? []) as TeachingSkill[])
    setWanted((results[4].data ?? []) as WantedSkill[])
    setRequests((results[5].data ?? []) as Request[])
    setExchanges((results[6].data ?? []) as Exchange[])
    setSessions((results[7].data ?? []) as Session[])
    setReviews((results[8].data ?? []) as Review[])
    setNotices((results[9].data ?? []) as Notice[])
    const savedId = Number(localStorage.getItem('campus-demo-student')) || 0
    if (studentRows.length && !studentRows.some((student) => student.student_id === savedId)) {
      const chosen = studentRows[0].student_id
      setStudentId(chosen)
      localStorage.setItem('campus-demo-student', String(chosen))
    } else if (studentRows.length && studentRows.some((student) => student.student_id === savedId)) {
      setStudentId(savedId)
    }
    setLoading(false)
    } catch (error) {
      showDemoFallback(error instanceof Error ? error.message : 'Supabase is unreachable')
    }
  }, [])

  useEffect(() => { void loadData() }, [loadData])

  const current = students.find((student) => student.student_id === studentId)
  const studentMap = useMemo(() => new Map(students.map((student) => [student.student_id, student])), [students])
  const skillMap = useMemo(() => new Map(skills.map((skill) => [skill.skill_id, skill])), [skills])
  const categoryMap = useMemo(() => new Map(categories.map((category) => [category.category_id, category.category_name])), [categories])
  const myTeaching = teaching.filter((item) => item.student_id === studentId)
  const myWanted = wanted.filter((item) => item.student_id === studentId)
  const incoming = requests.filter((request) => request.receiver_id === studentId)
  const outgoing = requests.filter((request) => request.sender_id === studentId)
  const unreadNotices = notices.filter((notice) => notice.student_id === studentId && !notice.is_read)
  const mySessions = sessions.filter((session) => session.mentor_id === studentId || session.learner_id === studentId)
  const myExchanges = exchanges.filter((exchange) => exchange.student_one_id === studentId || exchange.student_two_id === studentId)
  const ratingRows = reviews.filter((review) => review.reviewed_student_id === studentId)
  const averageRating = ratingRows.length ? (ratingRows.reduce((total, review) => total + review.rating, 0) / ratingRows.length).toFixed(1) : '—'
  const completedHours = mySessions.filter((session) => session.session_status === 'completed').reduce((total, session) => total + session.duration_minutes, 0) / 60

  const matches = useMemo(() => students.filter((peer) => peer.student_id !== studentId && peer.account_status === 'active').map((peer) => {
    const peerWants = wanted.filter((item) => item.student_id === peer.student_id)
    const peerTeaches = teaching.filter((item) => item.student_id === peer.student_id)
    const offered = myTeaching.find((mine) => peerWants.some((item) => item.skill_id === mine.skill_id))
    const requested = peerTeaches.find((theirs) => myWanted.some((item) => item.skill_id === theirs.skill_id))
    return { peer, offered, requested, peerTeaches, peerWants }
  }).filter((match) => match.offered && match.requested), [students, studentId, wanted, teaching, myTeaching, myWanted])

  const action = async (work: () => Promise<void>) => {
    if (busy) return
    if (!supabase || loadError) { notify('Sample preview is read-only. Connect to Supabase to save this change.'); return }
    setBusy(true)
    try { await work(); await loadData() }
    catch (error) { notify(error instanceof Error ? error.message : 'Something went wrong. Please try again.') }
    finally { setBusy(false) }
  }

  const sendRequest = async (peerId: number, offeredId: number, requestedId: number) => action(async () => {
    const duplicate = requests.find((request) => request.sender_id === studentId && request.receiver_id === peerId && request.status === 'pending')
    if (duplicate) { notify('You already have a pending request with this student.'); return }
    const { error } = await supabase!.from('exchange_requests').insert({ sender_id: studentId, receiver_id: peerId, offered_skill_id: offeredId, requested_skill_id: requestedId, request_message: `Hi! I can help you learn ${skillMap.get(offeredId)?.skill_name} and would love to learn ${skillMap.get(requestedId)?.skill_name}.` })
    if (error) throw error
    notify('Exchange request sent!')
  })

  const respond = async (request: Request, status: 'accepted' | 'rejected') => action(async () => {
    if (status === 'accepted') {
      const { data: exchange, error: exchangeError } = await supabase!.from('skill_exchanges').insert({
        request_id: request.request_id, student_one_id: request.sender_id, student_two_id: request.receiver_id,
        skill_one_id: request.offered_skill_id, skill_two_id: request.requested_skill_id,
        start_date: new Date().toISOString().slice(0, 10), exchange_status: 'scheduled',
      }).select('exchange_id').single()
      if (exchangeError) throw exchangeError
      const { error } = await supabase!.from('exchange_requests').update({ status, responded_at: new Date().toISOString() }).eq('request_id', request.request_id)
      if (error) {
        await supabase!.from('skill_exchanges').delete().eq('exchange_id', exchange.exchange_id)
        throw error
      }
    } else {
      const { error } = await supabase!.from('exchange_requests').update({ status, responded_at: new Date().toISOString() }).eq('request_id', request.request_id)
      if (error) throw error
    }
    notify(status === 'accepted' ? 'Request accepted. Your exchange is ready to schedule.' : 'Request declined.')
  })

  const addSkill = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const skillId = Number(form.get('skill_id'))
    const direction = String(form.get('direction'))
    await action(async () => {
      const { error } = direction === 'teach'
        ? await supabase!.from('student_skills').insert({ student_id: studentId, skill_id: skillId, proficiency_level: String(form.get('level')), experience_years: Number(form.get('experience') || 0), teaching_mode: 'either' })
        : await supabase!.from('wanted_skills').insert({ student_id: studentId, skill_id: skillId, target_level: String(form.get('level')), priority: 3 })
      if (error) throw error
      notify('Skill added to your profile.')
      formElement.reset()
    })
  }

  const removeTeachingSkill = async (studentSkillId: number) => action(async () => {
    const { error } = await supabase!.from('student_skills').delete().eq('student_skill_id', studentSkillId).eq('student_id', studentId)
    if (error) throw error
    notify('Teaching skill removed.')
  })

  const removeWantedSkill = async (wantedSkillId: number) => action(async () => {
    const { error } = await supabase!.from('wanted_skills').delete().eq('wanted_skill_id', wantedSkillId).eq('student_id', studentId)
    if (error) throw error
    notify('Learning skill removed.')
  })

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    await action(async () => {
      const { error } = await supabase!.from('students').update({ full_name: form.get('full_name'), department: form.get('department'), year_of_study: Number(form.get('year_of_study')), bio: form.get('bio') }).eq('student_id', studentId)
      if (error) throw error
      notify('Profile saved.')
    })
  }

  const scheduleSession = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const exchangeId = Number(form.get('exchange_id'))
    const exchange = myExchanges.find((row) => row.exchange_id === exchangeId)
    if (!exchange) return
    const asTeacher = String(form.get('direction')) === 'teach'
    const skillId = asTeacher ? (exchange.student_one_id === studentId ? exchange.skill_one_id : exchange.skill_two_id) : (exchange.student_one_id === studentId ? exchange.skill_two_id : exchange.skill_one_id)
    await action(async () => {
      const { error } = await supabase!.from('sessions').insert({
        exchange_id: exchangeId, mentor_id: asTeacher ? studentId : (exchange.student_one_id === studentId ? exchange.student_two_id : exchange.student_one_id),
        learner_id: asTeacher ? (exchange.student_one_id === studentId ? exchange.student_two_id : exchange.student_one_id) : studentId,
        skill_id: skillId, session_date: new Date(String(form.get('session_date'))).toISOString(),
        duration_minutes: Number(form.get('duration_minutes')), topic: form.get('topic'), meeting_mode: form.get('meeting_mode'), session_status: 'scheduled',
      })
      if (error) throw error
      notify('Learning session scheduled.')
      setShowSchedule(false)
    })
  }

  const markRead = async (noticeId: number) => action(async () => {
    const { error } = await supabase!.from('notifications').update({ is_read: true }).eq('notification_id', noticeId)
    if (error) throw error
    notify('Notification marked as read.')
  })

  const pageHeading: Record<Page, string> = { Overview: 'A little knowledge goes a long way.', Discover: 'Your next great exchange starts here.', Requests: 'Good things happen when you say yes.', Exchanges: 'Learning is better when it’s shared.', Sessions: 'Make time for what you want to learn.', 'My profile': 'Your skills make this community stronger.' }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); setPage('Overview') }}><span className="brand-icon"><Sparkles size={17} /></span><span>skill<span className="brand-soft">swap</span><i>.</i></span></a>
        <div className="campus-label">YOUR CAMPUS COMMUNITY</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-link ${page === label ? 'selected' : ''}`} onClick={() => { setPage(label); setMobileNav(false) }}><Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === 'Requests' && incoming.filter((request) => request.status === 'pending').length > 0 && <b className="nav-badge">{incoming.filter((request) => request.status === 'pending').length}</b>}</button>)}
        </nav>
        <div className="sidebar-note"><div className="note-art"><BookOpen size={17} /></div><strong>Teach a little.<br />Learn a lot.</strong><span>Every skill is worth sharing.</span></div>
        <div className="sidebar-footer"><div className="online-dot" /> Made for curious minds</div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-button" aria-label="Open menu" onClick={() => setMobileNav(!mobileNav)}><Menu size={19} /></button>
          <div className="breadcrumbs">Campus <span>/</span> <b>{page}</b></div>
          <div className="topbar-actions">
            <div className="connection-pill"><span className={loadError ? 'connection-off' : ''} />{loadError ? 'Not connected' : 'Live database'}</div>
            <button className="notification-button icon-button" aria-label={`${unreadNotices.length} unread notifications`} onClick={() => setPage('Overview')}><Bell size={18} />{unreadNotices.length > 0 && <i>{unreadNotices.length}</i>}</button>
            <label className="profile-picker"><span className="avatar avatar-mini">{current?.full_name.split(' ').map((name) => name[0]).slice(0, 2).join('') || 'CS'}</span><select aria-label="Choose demo student profile" value={studentId || ''} onChange={(event) => { const id = Number(event.target.value); setStudentId(id); localStorage.setItem('campus-demo-student', String(id)) }}><option value="" disabled>Choose student</option>{students.map((student) => <option key={student.student_id} value={student.student_id}>{student.full_name}</option>)}</select><ChevronDown size={14} /></label>
          </div>
        </header>

        <div className="page-content">
          {loadError && <div className="error-banner"><CircleAlert size={18} /><div><strong>Supabase connection status</strong><span>{loadError}</span></div><button onClick={() => void loadData()}>Try again</button></div>}
          <section className="page-intro"><div><div className="eyebrow"><span className="eyebrow-dot" /> CAMPUS SKILL EXCHANGE</div><h1>{page === 'Overview' ? <>Hey{current ? `, ${current.full_name.split(' ')[0]}` : ''}. <span className="title-spark">✳</span></> : page}</h1><p>{pageHeading[page]}</p></div><button className="button button-primary" onClick={() => setPage('My profile')}><Plus size={16} /> Add your skills</button></section>

          {loading ? <div className="loading-state"><LoaderCircle className="spin" size={22} /> Connecting to your campus database…</div> : !current ? <div className="empty-state"><UsersRound size={26} /><h3>No student profiles found</h3><p>Run the schema and seed SQL in Supabase, then reconnect.</p><button className="button button-outline" onClick={() => void loadData()}>Refresh data</button></div> : <>
            {page === 'Overview' && <Overview current={current} myTeaching={myTeaching} myWanted={myWanted} matches={matches} incoming={incoming} outgoing={outgoing} mySessions={mySessions} completedHours={completedHours} averageRating={averageRating} skillMap={skillMap} studentMap={studentMap} setPage={setPage} sendRequest={sendRequest} respond={respond} busy={busy} />}
            {page === 'Discover' && <Discover studentId={studentId} matches={matches} requests={requests} search={search} setSearch={setSearch} skillMap={skillMap} sendRequest={sendRequest} busy={busy} />}
            {page === 'Requests' && <Requests incoming={incoming} outgoing={outgoing} students={studentMap} skills={skillMap} respond={respond} busy={busy} />}
            {page === 'Exchanges' && <ExchangeList exchanges={myExchanges} studentId={studentId} students={studentMap} skills={skillMap} sessions={sessions} setPage={setPage} />}
            {page === 'Sessions' && <Sessions sessions={mySessions} studentId={studentId} students={studentMap} skills={skillMap} exchanges={myExchanges} showSchedule={showSchedule} setShowSchedule={setShowSchedule} scheduleSession={scheduleSession} />}
            {page === 'My profile' && <Profile current={current} teaching={myTeaching} wanted={myWanted} skills={skills} skillMap={skillMap} categoryMap={categoryMap} addSkill={addSkill} removeTeachingSkill={removeTeachingSkill} removeWantedSkill={removeWantedSkill} saveProfile={saveProfile} busy={busy} />}
            <section className="notice-strip"><div className="notice-heading"><span className="notice-icon"><Bell size={15} /></span><div><b>From your campus</b><small>{unreadNotices.length ? `${unreadNotices.length} unread update${unreadNotices.length === 1 ? '' : 's'}` : 'You’re all caught up'}</small></div></div>{unreadNotices.slice(0, 2).map((notice) => <div className="notice-item" key={notice.notification_id}><span><b>{notice.title}</b><small>{notice.message}</small></span><button title="Mark read" onClick={() => void markRead(notice.notification_id)}><Check size={15} /></button></div>)}</section>
          </>}
          <footer className="page-footer"><span>✳</span> Knowledge grows when it’s shared <span className="footer-right">Campus Skill Exchange · 2026</span></footer>
        </div>
      </main>
      {toast && <div className="toast"><Check size={16} />{toast}</div>}
    </div>
  )
}

type Match = { peer: Student; offered?: TeachingSkill; requested?: TeachingSkill; peerTeaches: TeachingSkill[]; peerWants: WantedSkill[] }

function Overview(props: { current: Student; myTeaching: TeachingSkill[]; myWanted: WantedSkill[]; matches: Match[]; incoming: Request[]; outgoing: Request[]; mySessions: Session[]; completedHours: number; averageRating: string; skillMap: Map<number, Skill>; studentMap: Map<number, Student>; setPage: (page: Page) => void; sendRequest: (peerId: number, offeredId: number, requestedId: number) => Promise<void>; respond: (request: Request, status: 'accepted' | 'rejected') => Promise<void>; busy: boolean }) {
  const { myTeaching, myWanted, matches, incoming, outgoing, mySessions, completedHours, averageRating, skillMap, studentMap, setPage, sendRequest, respond, busy } = props
  const nextSessions = mySessions.filter((session) => session.session_status === 'scheduled').slice(0, 2)
  const pending = incoming.filter((request) => request.status === 'pending').slice(0, 2)
  return <>
    <div className="stats-grid">
      <Stat icon={<ArrowUpRight size={17} />} label="READY TO TEACH" value={String(myTeaching.length)} detail="Your skills, passed forward" tone="lime" />
      <Stat icon={<BookOpen size={17} />} label="ON YOUR LEARNING LIST" value={String(myWanted.length)} detail="New things start here" tone="peach" />
      <Stat icon={<Sparkles size={17} />} label="RECIPROCAL MATCHES" value={String(matches.length)} detail="Skills that fit both ways" tone="lavender" />
      <Stat icon={<Clock3 size={17} />} label="HOURS SHARED" value={`${completedHours.toFixed(completedHours % 1 ? 1 : 0)}h`} detail={`★ ${averageRating} average student rating`} tone="sky" />
    </div>
    <div className="overview-grid">
      <section className="surface match-surface"><PanelHeading eyebrow="MADE FOR YOUR SKILL MIX" title="People to learn with" action="See all matches" onAction={() => setPage('Discover')} /><div className="match-list">{matches.slice(0, 3).map((match, index) => <MatchCard key={match.peer.student_id} match={match} index={index} onConnect={() => void sendRequest(match.peer.student_id, match.offered!.skill_id, match.requested!.skill_id)} connected={outgoing.some((request) => request.receiver_id === match.peer.student_id && request.status === 'pending')} busy={busy} skillMap={skillMap} />)}{matches.length === 0 && <EmptySmall title="Your matches are waiting" text="Add at least one skill to teach and one to learn in your profile." action="Build your profile" onClick={() => setPage('My profile')} />}</div></section>
      <section className="surface request-surface"><PanelHeading eyebrow="A LITTLE INBOX LOVE" title="Incoming requests" action="View all" onAction={() => setPage('Requests')} />{pending.length ? pending.map((request) => <RequestMini key={request.request_id} name={studentMap.get(request.sender_id)?.full_name ?? 'Student'} offered={skillMap.get(request.offered_skill_id)?.skill_name ?? 'a skill'} requested={skillMap.get(request.requested_skill_id)?.skill_name ?? 'a skill'} onAccept={() => void respond(request, 'accepted')} onReject={() => void respond(request, 'rejected')} busy={busy} />) : <EmptySmall title="No new requests" text="When a student reaches out, you’ll find them here." />}</section>
    </div>
    <section className="surface session-surface"><PanelHeading eyebrow="PUT SOMETHING ON THE CALENDAR" title="Your next sessions" action="Open sessions" onAction={() => setPage('Sessions')} />{nextSessions.length ? <div className="session-list">{nextSessions.map((session) => <SessionRow key={session.session_id} session={session} partner={studentMap.get(session.mentor_id === props.current.student_id ? session.learner_id : session.mentor_id)?.full_name ?? 'Your exchange partner'} skill={skillMap.get(session.skill_id)?.skill_name ?? 'Skill session'} />)}</div> : <div className="session-empty"><span className="calendar-illustration"><CalendarDays size={23} /></span><span><b>A good time to plan a session.</b><small>Your accepted exchanges make it easy to get started.</small></span><button className="button button-outline" onClick={() => setPage('Sessions')}>Plan a session <ArrowRight size={14} /></button></div>}</section>
  </>
}

function Stat({ icon, label, value, detail, tone }: { icon: React.ReactNode; label: string; value: string; detail: string; tone: string }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div></article>
}

function PanelHeading({ eyebrow, title, action, onAction }: { eyebrow: string; title: string; action?: string; onAction?: () => void }) {
  return <div className="panel-heading"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2></div>{action && <button className="text-action" onClick={onAction}>{action} <ArrowRight size={14} /></button>}</div>
}

function MatchCard({ match, index, onConnect, connected, busy, skillMap }: { match: Match; index: number; onConnect: () => void; connected: boolean; busy: boolean; skillMap: Map<number, Skill> }) {
  const initials = match.peer.full_name.split(' ').map((part) => part[0]).slice(0, 2).join('')
  const tones = ['mint', 'lavender', 'peach', 'sky']
  return <article className="match-card"><div className={`avatar match-avatar ${tones[index % tones.length]}`}>{initials}</div><div className="match-person"><div className="match-name">{match.peer.full_name}<span className="match-check" title="Active student">✓</span></div><div className="match-meta">{match.peer.department} · Year {match.peer.year_of_study}</div><div className="skill-pair"><span className="skill-teach"><ArrowUpRight size={12} /> teaches {skillMap.get(match.offered!.skill_id)?.skill_name}</span><span className="skill-learn"><ArrowDownLeft size={12} /> learns {skillMap.get(match.requested!.skill_id)?.skill_name}</span></div></div><button className={`connect-button ${connected ? 'is-connected' : ''}`} disabled={busy || connected} onClick={onConnect}>{connected ? <><Check size={14} /> Sent</> : <><Send size={13} /> Connect</>}</button></article>
}

function EmptySmall({ title, text, action, onClick }: { title: string; text: string; action?: string; onClick?: () => void }) {
  return <div className="empty-small"><span className="empty-spark">✳</span><div><b>{title}</b><small>{text}</small>{action && <button onClick={onClick}>{action} <ArrowRight size={13} /></button>}</div></div>
}

function RequestMini({ name, offered, requested, onAccept, onReject, busy }: { name: string; offered: string; requested: string; onAccept: () => void; onReject: () => void; busy: boolean }) {
  return <div className="request-mini"><div className="avatar avatar-small peach">{name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div className="request-mini-info"><b>{name}</b><small>Offers {offered} <span>·</span> wants {requested}</small><div className="request-mini-actions"><button disabled={busy} onClick={onAccept}><Check size={13} /> Accept</button><button disabled={busy} onClick={onReject}>Decline</button></div></div><span className="request-dot" /></div>
}

function SessionRow({ session, partner, skill }: { session: Session; partner: string; skill: string }) {
  const date = new Date(session.session_date)
  return <div className="session-row"><div className="date-block"><b>{date.toLocaleDateString('en', { day: '2-digit', timeZone: 'UTC' })}</b><span>{date.toLocaleDateString('en', { month: 'short', timeZone: 'UTC' }).toUpperCase()}</span></div><div className="session-copy"><b>{session.topic}</b><small>{skill} · With {partner}</small></div><div className="session-time"><Clock3 size={13} />{date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div><span className="mode-pill"><Wifi size={12} />{session.meeting_mode === 'online' ? 'Online' : 'In person'}</span></div>
}

function Discover({ studentId, matches, requests, search, setSearch, skillMap, sendRequest, busy }: { studentId: number; matches: Match[]; requests: Request[]; search: string; setSearch: (value: string) => void; skillMap: Map<number, Skill>; sendRequest: (peerId: number, offeredId: number, requestedId: number) => Promise<void>; busy: boolean }) {
  const filtered = matches.filter((match) => `${match.peer.full_name} ${match.peer.department} ${skillMap.get(match.offered!.skill_id)?.skill_name} ${skillMap.get(match.requested!.skill_id)?.skill_name}`.toLowerCase().includes(search.toLowerCase()))
  return <section className="surface discover-surface">
    <div className="discover-toolbar">
      <div><div className="eyebrow">SKILLS THAT GO BOTH WAYS</div><h2>Reciprocal matches <span className="count-pill">{filtered.length}</span></h2><p>Each person has something you want to learn, and wants something you can teach.</p></div>
      <label className="search-field"><Search size={16} /><input placeholder="Search people or skills" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
    </div>
    <div className="discover-grid">
      {filtered.map((match, index) => <div className="discover-card" key={match.peer.student_id}>
        <MatchCard
          match={match}
          index={index}
          onConnect={() => void sendRequest(match.peer.student_id, match.offered!.skill_id, match.requested!.skill_id)}
          connected={requests.some((request) => request.sender_id === studentId && request.receiver_id === match.peer.student_id && request.status === 'pending')}
          busy={busy}
          skillMap={skillMap}
        />
        <p className="bio-snippet">{match.peer.bio || 'A fellow student ready to share what they know.'}</p>
        <div className="discover-card-bottom"><span><Sparkles size={13} /> Two-way skill match</span><span>Year {match.peer.year_of_study}</span></div>
      </div>)}
    </div>
    {filtered.length === 0 && <EmptySmall title="No matches just yet" text="Try another search or add more skills to your profile." />}
  </section>
}

function Requests({ incoming, outgoing, students, skills, respond, busy }: { incoming: Request[]; outgoing: Request[]; students: Map<number, Student>; skills: Map<number, Skill>; respond: (request: Request, status: 'accepted' | 'rejected') => Promise<void>; busy: boolean }) {
  const pendingIn = incoming.filter((request) => request.status === 'pending')
  const others = [...incoming.filter((request) => request.status !== 'pending'), ...outgoing].sort((a, b) => b.requested_at.localeCompare(a.requested_at))
  const incomingIds = new Set(incoming.map((request) => request.request_id))
  return <div className="stack-layout"><section className="surface"><PanelHeading eyebrow="WAITING FOR YOUR REPLY" title="Incoming requests" />{pendingIn.length ? pendingIn.map((request) => <div className="request-full" key={request.request_id}><div className="avatar avatar-small lavender">{(students.get(request.sender_id)?.full_name ?? 'CS').split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div className="request-full-copy"><b>{students.get(request.sender_id)?.full_name ?? 'Student'}</b><small>{students.get(request.sender_id)?.department} · wants an exchange</small><p>{request.request_message || `Offers ${skills.get(request.offered_skill_id)?.skill_name} and wants ${skills.get(request.requested_skill_id)?.skill_name}.`}</p><div className="skill-pair"><span className="skill-teach">Offers {skills.get(request.offered_skill_id)?.skill_name}</span><span className="skill-learn">Wants {skills.get(request.requested_skill_id)?.skill_name}</span></div></div><div className="request-full-actions"><button className="button button-primary" disabled={busy} onClick={() => void respond(request, 'accepted')}><Check size={14} /> Accept & start</button><button className="decline-button" disabled={busy} onClick={() => void respond(request, 'rejected')}>Decline</button></div></div>) : <EmptySmall title="Nothing waiting on you" text="Connect with a match and their request will show up here." />}</section><section className="surface"><PanelHeading eyebrow="YOUR RECENT ACTIVITY" title="Request history" />{others.length ? others.map((request) => { const inbound = incomingIds.has(request.request_id); const other = inbound ? request.sender_id : request.receiver_id; return <div className="history-row" key={`${request.request_id}-${inbound}`}><div className="history-avatar"><Repeat2 size={16} /></div><div><b>{inbound ? 'From' : 'To'} {students.get(other)?.full_name ?? 'Student'}</b><small>{skills.get(request.offered_skill_id)?.skill_name} ↔ {skills.get(request.requested_skill_id)?.skill_name}</small></div><span className={`status-tag status-${request.status}`}>{request.status}</span></div> }) : <EmptySmall title="A fresh start" text="Your sent and completed requests will be listed here." />}</section></div>
}

function ExchangeList({ exchanges, studentId, students, skills, sessions, setPage }: { exchanges: Exchange[]; studentId: number; students: Map<number, Student>; skills: Map<number, Skill>; sessions: Session[]; setPage: (page: Page) => void }) {
  return <section className="surface"><PanelHeading eyebrow="YOUR SHARED LEARNING JOURNEYS" title="My exchanges" action="Schedule a session" onAction={() => setPage('Sessions')} />{exchanges.length ? <div className="exchange-grid">{exchanges.map((exchange) => { const first = exchange.student_one_id === studentId; const partnerId = first ? exchange.student_two_id : exchange.student_one_id; const teachSkill = skills.get(first ? exchange.skill_one_id : exchange.skill_two_id)?.skill_name; const learnSkill = skills.get(first ? exchange.skill_two_id : exchange.skill_one_id)?.skill_name; const count = sessions.filter((session) => session.exchange_id === exchange.exchange_id).length; return <article className="exchange-card" key={exchange.exchange_id}><div className="exchange-card-top"><span className="exchange-icon"><Repeat2 size={17} /></span><span className={`status-tag status-${exchange.exchange_status}`}>{exchange.exchange_status}</span></div><h3>Learning with {students.get(partnerId)?.full_name ?? 'Student'}</h3><p>{students.get(partnerId)?.department}</p><div className="exchange-skills"><span><ArrowUpRight size={13} /> You teach <b>{teachSkill}</b></span><span><ArrowDownLeft size={13} /> You learn <b>{learnSkill}</b></span></div><div className="exchange-card-footer"><span><CalendarDays size={13} /> Since {new Date(`${exchange.start_date}T12:00:00`).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span><span>{count} session{count === 1 ? '' : 's'}</span></div></article> })}</div> : <EmptySmall title="Your first exchange is one good conversation away" text="Discover a reciprocal match and send them a request to get started." action="Discover students" onClick={() => setPage('Discover')} />}</section>
}

function Sessions({ sessions, studentId, students, skills, exchanges, showSchedule, setShowSchedule, scheduleSession }: { sessions: Session[]; studentId: number; students: Map<number, Student>; skills: Map<number, Skill>; exchanges: Exchange[]; showSchedule: boolean; setShowSchedule: (value: boolean) => void; scheduleSession: (event: FormEvent<HTMLFormElement>) => Promise<void> }) {
  const sorted = [...sessions].sort((a, b) => a.session_date.localeCompare(b.session_date))
  return <section className="surface"><div className="panel-heading"><div><div className="eyebrow">A LITTLE TIME ADDS UP</div><h2>Your learning sessions</h2></div><button className="button button-primary" onClick={() => setShowSchedule(!showSchedule)} disabled={!exchanges.length}><Plus size={15} /> Schedule a session</button></div>{showSchedule && <form className="schedule-form" onSubmit={(event) => void scheduleSession(event)}><label>Exchange<select name="exchange_id" required>{exchanges.map((exchange) => <option key={exchange.exchange_id} value={exchange.exchange_id}>With {students.get(exchange.student_one_id === studentId ? exchange.student_two_id : exchange.student_one_id)?.full_name}</option>)}</select></label><label>Session focus<select name="direction"><option value="learn">I’m learning</option><option value="teach">I’m teaching</option></select></label><label>Topic<input name="topic" required placeholder="What will you work on?" /></label><label>Date & time<input type="datetime-local" name="session_date" required min={new Date().toISOString().slice(0, 16)} /></label><label>Length<select name="duration_minutes"><option value="60">60 minutes</option><option value="45">45 minutes</option><option value="90">90 minutes</option></select></label><label>Meeting style<select name="meeting_mode"><option value="online">Online</option><option value="in_person">In person</option></select></label><div className="schedule-submit"><button className="button button-outline" type="button" onClick={() => setShowSchedule(false)}>Cancel</button><button className="button button-primary" type="submit">Save session</button></div></form>}{sorted.length ? <div className="sessions-full">{sorted.map((session) => { const partner = session.mentor_id === studentId ? session.learner_id : session.mentor_id; return <div className="session-row" key={session.session_id}><div className="date-block"><b>{new Date(session.session_date).toLocaleDateString('en', { day: '2-digit', timeZone: 'UTC' })}</b><span>{new Date(session.session_date).toLocaleDateString('en', { month: 'short', timeZone: 'UTC' }).toUpperCase()}</span></div><div className="session-copy"><b>{session.topic}</b><small>{skills.get(session.skill_id)?.skill_name} · {session.mentor_id === studentId ? 'You’re teaching' : 'You’re learning'} with {students.get(partner)?.full_name}</small></div><span className="mode-pill">{session.meeting_mode === 'online' ? 'Online' : 'In person'}</span><span className={`status-tag status-${session.session_status}`}>{session.session_status}</span></div> })}</div> : <EmptySmall title="No sessions on your calendar" text={exchanges.length ? 'Set up your first session with an exchange partner.' : 'Once an exchange is accepted, you can schedule sessions here.'} />}</section>
}

function Profile({ current, teaching, wanted, skills, skillMap, categoryMap, addSkill, removeTeachingSkill, removeWantedSkill, saveProfile, busy }: { current: Student; teaching: TeachingSkill[]; wanted: WantedSkill[]; skills: Skill[]; skillMap: Map<number, Skill>; categoryMap: Map<number, string>; addSkill: (event: FormEvent<HTMLFormElement>) => Promise<void>; removeTeachingSkill: (studentSkillId: number) => Promise<void>; removeWantedSkill: (wantedSkillId: number) => Promise<void>; saveProfile: (event: FormEvent<HTMLFormElement>) => Promise<void>; busy: boolean }) {
  const teacherIds = new Set(teaching.map((item) => item.skill_id))
  const wantedIds = new Set(wanted.map((item) => item.skill_id))
  const initials = current.full_name.split(' ').map((part) => part[0]).slice(0, 2).join('')
  return <div className="profile-grid"><section className="surface profile-card"><div className="profile-hero"><div className="avatar profile-avatar">{initials}</div><div><div className="eyebrow">YOUR STUDENT PROFILE</div><h2>{current.full_name}</h2><span>{current.department} · Year {current.year_of_study}</span></div></div><form className="profile-form" onSubmit={(event) => void saveProfile(event)}><label>Full name<input name="full_name" defaultValue={current.full_name} required /></label><label>Department<input name="department" defaultValue={current.department} required /></label><label>Year of study<select name="year_of_study" defaultValue={current.year_of_study}>{[1, 2, 3, 4, 5, 6, 7, 8].map((year) => <option key={year} value={year}>Year {year}</option>)}</select></label><label className="wide-field">A little about you<textarea name="bio" defaultValue={current.bio ?? ''} placeholder="What are you curious about?" rows={3} /></label><div className="wide-field profile-email">Campus email <b>{current.email}</b></div><button className="button button-primary" type="submit" disabled={busy}>Save profile</button></form></section><div className="profile-skills"><section className="surface"><PanelHeading eyebrow="WHAT YOU CAN PASS ON" title="Skills I can teach" />{teaching.length ? teaching.map((item) => <div className="skill-list-row" key={item.student_skill_id}><span className="skill-mark teach-mark"><ArrowUpRight size={15} /></span><span><b>{skillMap.get(item.skill_id)?.skill_name}</b><small>{item.proficiency_level} · {item.experience_years} years</small></span><button className="skill-remove-button" type="button" aria-label={`Remove ${skillMap.get(item.skill_id)?.skill_name}`} disabled={busy} onClick={() => void removeTeachingSkill(item.student_skill_id)}><Trash2 size={15} /></button></div>) : <EmptySmall title="Add a skill you know" text="Everyone has something to teach." />}</section><section className="surface"><PanelHeading eyebrow="WHAT YOU’RE CURIOUS ABOUT" title="Skills I want to learn" />{wanted.length ? wanted.map((item) => <div className="skill-list-row" key={item.wanted_skill_id}><span className="skill-mark learn-mark"><ArrowDownLeft size={15} /></span><span><b>{skillMap.get(item.skill_id)?.skill_name}</b><small>Target: {item.target_level}</small></span><button className="skill-remove-button" type="button" aria-label={`Remove ${skillMap.get(item.skill_id)?.skill_name}`} disabled={busy} onClick={() => void removeWantedSkill(item.wanted_skill_id)}><Trash2 size={15} /></button></div>) : <EmptySmall title="Add something you want to learn" text="This helps us find your kind of match." />}</section></div><section className="surface add-skill-panel"><PanelHeading eyebrow="KEEP YOUR PROFILE GROWING" title="Add a skill" /><form className="add-skill-form" onSubmit={(event) => void addSkill(event)}><label>Skill<select name="skill_id" required defaultValue=""> <option value="" disabled>Choose a skill</option>{skills.map((skill) => <option key={skill.skill_id} value={skill.skill_id} disabled={teacherIds.has(skill.skill_id) && wantedIds.has(skill.skill_id)}>{skill.skill_name} · {categoryMap.get(skill.category_id)}</option>)}</select></label><label>I want to<select name="direction"><option value="teach">Teach it</option><option value="learn">Learn it</option></select></label><label>Level<select name="level"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="expert">Expert</option></select></label><label className="experience-field">Experience in years<input name="experience" type="number" min="0" max="99" step="0.5" defaultValue="0" /></label><button className="button button-primary" type="submit" disabled={busy}><Plus size={15} /> Add skill</button></form></section></div>
}

export default App
