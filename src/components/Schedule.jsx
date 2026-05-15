// 내 입주 · 이사 일정 — MovingPlanner UI 기반 + 다운로드 (CSV/TXT/ICS)
function Schedule({ ddayDate }) {
  // 기본 추천 일정 — 핵심 7개만 (인테리어/시공/통신 등 부가 항목은 필요 시 '할 일 추가'로)
  const TEMPLATE = [
    { id: 't_int',   when: -60, title: '인테리어 상담·계약 (3곳 비교)', cat: '인테리어' },
    { id: 't_clean', when: -30, title: '입주청소 업체 예약',             cat: '예약' },
    { id: 't_elev',  when: -10, title: '엘리베이터 사용 신청',            cat: '관리' },
    { id: 't_paid',  when: -7,  title: '잔금 납부 + 키 수령',             cat: '잔금' },
    { id: 't_day',   when: 0,   title: '이사 당일 + 입주청소',            cat: '이사' },
    { id: 't_reg',   when: 5,   title: '전입신고 + 확정일자 (정부24)',    cat: '행정' },
    { id: 't_tax',   when: 30,  title: '취득세 납부 / 등기',               cat: '세금' },
  ];

  const STORAGE_KEY = 'jcp-schedule-v4'; // default 슬림화로 인한 키 bump
  const [tasks, setTasks] = React.useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && Array.isArray(saved)) return saved;
    } catch {}
    return TEMPLATE.map(t => ({ ...t, done: false }));
  });

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const [newTitle, setNewTitle] = React.useState('');
  const [newWhen, setNewWhen] = React.useState(-7);
  const [newCat, setNewCat] = React.useState('이사');

  const addTask = () => {
    if (!newTitle.trim()) return;
    const id = 'u' + Date.now();
    setTasks([...tasks, { id, when: +newWhen, title: newTitle.trim(), cat: newCat, done: false }]);
    setNewTitle('');
  };

  const toggle = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id) => setTasks(tasks.filter(t => t.id !== id));

  const dateFor = (offset) => {
    if (!ddayDate) return null;
    const d = new Date(ddayDate);
    d.setDate(d.getDate() + offset);
    return d;
  };

  const dateLabel = (offset) => {
    const d = dateFor(offset);
    const dday = offset === 0 ? 'D-Day' : offset > 0 ? `D+${offset}` : `D${offset}`;
    return d ? `${d.getMonth()+1}/${d.getDate()} · ${dday}` : dday;
  };

  // 3 그룹 분류 (MovingPlanner UI)
  const sorted = [...tasks].sort((a, b) => a.when - b.when);
  const groups = {
    before: sorted.filter(t => t.when < -7),
    week:   sorted.filter(t => t.when >= -7 && t.when <= 0),
    after:  sorted.filter(t => t.when > 0),
  };

  const doneCount = tasks.filter(t => t.done).length;
  const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  // ─────── 다운로드 ───────
  const downloadFile = (filename, content, mime = 'text/plain;charset=utf-8') => {
    const blob = new Blob(['﻿' + content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const exportCSV = () => {
    const head = ['순서','D-Day','날짜','카테고리','항목','완료'];
    const rows = sorted.map((it, i) => {
      const d = dateFor(it.when);
      const dateStr = d ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` : '';
      const dday = it.when === 0 ? 'D-Day' : it.when > 0 ? `D+${it.when}` : `D${it.when}`;
      const esc = (s) => `"${String(s||'').replace(/"/g,'""')}"`;
      return [i+1, dday, dateStr, it.cat, it.title, it.done?'Y':'N'].map(esc).join(',');
    });
    const csv = [head.map(h=>`"${h}"`).join(','), ...rows].join('\r\n');
    downloadFile('주안센트럴파라곤_입주이사일정.csv', csv, 'text/csv;charset=utf-8');
  };

  const exportTXT = () => {
    const lines = [
      '주안센트럴파라곤 — 내 입주 · 이사 일정',
      ddayDate ? `입주 예정일: ${ddayDate}` : '입주 예정일: 미정 (Tweaks 패널에서 설정)',
      `생성일: ${new Date().toISOString().slice(0,10)}`,
      `진행률: ${doneCount} / ${tasks.length} (${pct}%)`,
      '─'.repeat(50),
      '',
    ];
    sorted.forEach((it, i) => {
      lines.push(`${String(i+1).padStart(2,'0')}. [${it.done?'✓':' '}] ${dateLabel(it.when)}`);
      lines.push(`    [${it.cat}] ${it.title}`);
      lines.push('');
    });
    downloadFile('주안센트럴파라곤_입주이사일정.txt', lines.join('\r\n'));
  };

  const exportICS = () => {
    if (!ddayDate) {
      alert('캘린더(ICS) 형식으로 받으려면 입주 예정일을 먼저 설정해주세요. (Tweaks 패널 → 입주 예정일)');
      return;
    }
    const pad = (n) => String(n).padStart(2,'0');
    const fmtICSDate = (d) => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
    const now = new Date();
    const stamp = `${fmtICSDate(now)}T${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}Z`;
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//JCParagon//Move-in Schedule//KO',
      'CALSCALE:GREGORIAN',
    ];
    sorted.forEach(it => {
      const start = dateFor(it.when);
      const end = dateFor(it.when + 1);
      ics.push('BEGIN:VEVENT');
      ics.push(`UID:${it.id}@jcparagon`);
      ics.push(`DTSTAMP:${stamp}`);
      ics.push(`DTSTART;VALUE=DATE:${fmtICSDate(start)}`);
      ics.push(`DTEND;VALUE=DATE:${fmtICSDate(end)}`);
      ics.push(`SUMMARY:[${it.cat}] ${it.title}`);
      ics.push('END:VEVENT');
    });
    ics.push('END:VCALENDAR');
    downloadFile('주안센트럴파라곤_입주이사일정.ics', ics.join('\r\n'), 'text/calendar;charset=utf-8');
  };

  const resetAll = () => {
    if (!confirm('일정을 기본 추천으로 되돌릴까요? 추가/수정한 모든 항목이 사라집니다.')) return;
    setTasks(TEMPLATE.map(t => ({ ...t, done: false })));
  };

  return (
    <section id="schedule" className="section">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">SECTION 02 — 입주 · 이사 일정</span>
            <h2 className="section-title">내 일정에 맞춘 입주·이사 계획</h2>
            <p className="section-sub">
              입주일 기준 D-Day로 자동 정렬. 인테리어·시공·이사·행정까지 한 곳에서.
            </p>
            {ddayDate && (
              <div style={{marginTop:8, display:'inline-flex', alignItems:'center', gap:6, padding:'4px 10px', background:'var(--accent-soft)', color:'var(--accent-text)', borderRadius:'var(--r-full)', fontSize:12, fontWeight:600}}>
                입주 예정일 · <span className="num">{ddayDate}</span>
              </div>
            )}
          </div>
          <div className="schedule-progress">
            <div className="row-between" style={{marginBottom:6}}>
              <span className="dim" style={{fontSize:12, fontWeight:600}}>완료</span>
              <span className="num" style={{fontSize:14, fontWeight:700}}>{doneCount} / {tasks.length}</span>
            </div>
            <div className="progress-bar"><div style={{width: `${pct}%`}}></div></div>
          </div>
        </div>

        {/* 컨트롤 바: 항목 추가 + 다운로드 */}
        <div className="card card-lg task-control">
          <div className="task-form">
            <div className="task-form-heading">
              <Icon.Plus size={14} />
              <span>새 할 일 추가</span>
            </div>
            <div className="task-form-title">
              <label htmlFor="newTaskTitle">할 일</label>
              <input
                id="newTaskTitle"
                type="text"
                placeholder="예: 우편물 이전, 사전점검 방문"
                value={newTitle}
                onChange={e=>setNewTitle(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter') addTask();}}
              />
            </div>
            <div className="task-form-meta">
              <div className="field">
                <label htmlFor="newTaskWhen">시점</label>
                <select id="newTaskWhen" value={newWhen} onChange={e=>setNewWhen(+e.target.value)}>
                  <option value={-60}>D-60 (2달 전)</option>
                  <option value={-45}>D-45</option>
                  <option value={-30}>D-30 (1달 전)</option>
                  <option value={-14}>D-14 (2주 전)</option>
                  <option value={-7}>D-7 (1주 전)</option>
                  <option value={-3}>D-3 (3일 전)</option>
                  <option value={0}>D-Day (입주일)</option>
                  <option value={3}>D+3</option>
                  <option value={7}>D+7</option>
                  <option value={14}>D+14</option>
                  <option value={30}>D+30</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="newTaskCat">카테고리</label>
                <select id="newTaskCat" value={newCat} onChange={e=>setNewCat(e.target.value)}>
                  <option>점검</option><option>인테리어</option><option>시공</option>
                  <option>청소</option><option>예약</option><option>통신</option>
                  <option>공과금</option><option>가전</option><option>관리</option>
                  <option>잔금</option><option>이사</option><option>행정</option><option>세금</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary task-form-add" onClick={addTask} disabled={!newTitle.trim()}>
              <Icon.Plus /> 일정 추가
            </button>
          </div>

          <div className="task-actions">
            <span className="task-actions-label">📥 다운로드</span>
            <div className="task-actions-buttons">
              <button className="btn btn-primary btn-sm" onClick={exportCSV} title="엑셀에서 열기">
                <Icon.Download size={12} /> CSV
              </button>
              <button className="btn btn-sm" onClick={exportICS} title="구글캘린더·아이폰에 등록">
                <Icon.Calendar size={12} /> ICS
              </button>
              <button className="btn btn-ghost btn-sm" onClick={exportTXT} title="텍스트로 받기">
                <Icon.Doc size={12} /> TXT
              </button>
              <button className="btn btn-ghost btn-sm task-reset" onClick={resetAll} title="기본 추천으로 초기화">
                <Icon.Close size={12} /> 초기화
              </button>
            </div>
          </div>
        </div>

        {/* 3 컬럼 그룹 (MovingPlanner UI) */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:20}}>
          <PlannerColumn title="입주 전 (D-8 이전)"   sub={`${groups.before.length}개`} tasks={groups.before} dateLabel={dateLabel} onToggle={toggle} onRemove={remove} />
          <PlannerColumn title="입주 주간 (D-7 ~ D)" sub={`${groups.week.length}개`}   tasks={groups.week}   dateLabel={dateLabel} onToggle={toggle} onRemove={remove} highlight />
          <PlannerColumn title="입주 후 (D+1 이후)"  sub={`${groups.after.length}개`}  tasks={groups.after}  dateLabel={dateLabel} onToggle={toggle} onRemove={remove} />
        </div>
      </div>
    </section>
  );
}

function PlannerColumn({ title, sub, tasks, dateLabel, onToggle, onRemove, highlight }) {
  return (
    <div className="card card-lg" style={{padding:20, background: highlight ? 'var(--accent-soft)' : 'var(--surface)'}}>
      <div className="row-between" style={{marginBottom:14}}>
        <h4 style={{margin:0, fontSize:14, fontWeight:700, letterSpacing:'-.01em', color: highlight ? 'var(--accent-text)' : 'var(--text-1)'}}>{title}</h4>
        <span className="chip">{sub}</span>
      </div>
      <div className="mover-list">
        {tasks.length === 0 && <div className="dim" style={{fontSize:13, padding:'8px 0'}}>아직 일정이 없습니다.</div>}
        {tasks.map(t => (
          <div key={t.id} className={`mover-task ${t.done?'done':''}`}>
            <button
              className="check-box"
              style={{width:22, height:22, padding:0, border:'1.5px solid var(--border-strong)', background: t.done ? 'var(--text-1)' : 'transparent', color: t.done ? 'var(--bg)' : 'transparent', borderRadius:7, cursor:'pointer'}}
              onClick={()=>onToggle(t.id)}>
              {t.done && <Icon.Check size={12} />}
            </button>
            <div>
              <div className="mover-title">{t.title}</div>
              <div className="row gap-8" style={{marginTop:3}}>
                <span className="mover-when">{dateLabel(t.when)}</span>
                <span className="mover-tag">{t.cat}</span>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={()=>onRemove(t.id)} title="삭제" style={{padding:'4px 8px'}}>
              <Icon.Close size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

window.Schedule = Schedule;
