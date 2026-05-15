// 내 입주 · 이사 일정 — MovingPlanner UI 기반 + 다운로드 (CSV/TXT/ICS)
function Schedule({ ddayDate }) {
  // 기본 추천 일정 (이사·시공·입주·행정 통합)
  // 사전점검·시스템에어컨은 기본에서 제외 (필요 시 직접 추가)
  const TEMPLATE = [
    { id: 't_int',   when: -60, title: '인테리어 상담·계약 (3곳 비교)', cat: '인테리어' },
    { id: 't_move',  when: -45, title: '이사업체 3곳 견적 비교',         cat: '예약' },
    { id: 't_clean', when: -30, title: '입주청소 업체 예약',             cat: '예약' },
    { id: 't_net',   when: -21, title: '인터넷·TV 이전 신청',            cat: '통신' },
    { id: 't_film',  when: -15, title: '필름 시공',                       cat: '인테리어' },
    { id: 't_gas',   when: -14, title: '도시가스 전출/전입 예약',         cat: '공과금' },
    { id: 't_app',   when: -14, title: '가전(세탁기/에어컨) 이전 설치 예약', cat: '가전' },
    { id: 't_wall',  when: -12, title: '도배 시공',                       cat: '인테리어' },
    { id: 't_floor', when: -10, title: '마루 시공',                       cat: '인테리어' },
    { id: 't_elev',  when: -10, title: '엘리베이터 사용 신청',            cat: '관리' },
    { id: 't_paid',  when: -7,  title: '잔금 납부 + 키 수령',             cat: '잔금' },
    { id: 't_pack',  when: -3,  title: '이삿짐 정리 / 폐기물 신고',       cat: '정리' },
    { id: 't_day',   when: 0,   title: '이사 당일 — 엘리베이터 시간 확인', cat: '이사' },
    { id: 't_clean2',when: 0,   title: '입주청소 (키 수령 직후)',         cat: '청소' },
    { id: 't_joint', when: 1,   title: '줄눈 시공',                       cat: '시공' },
    { id: 't_reg',   when: 5,   title: '전입신고 + 확정일자 (정부24)',    cat: '행정' },
    { id: 't_car',   when: 14,  title: '자동차 주소 변경 (위택스)',       cat: '행정' },
    { id: 't_tax',   when: 30,  title: '취득세 납부 / 등기',               cat: '세금' },
  ];

  const STORAGE_KEY = 'jcp-schedule-v3';
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
              {ddayDate && <> · 입주 예정일: <strong>{ddayDate}</strong></>}
            </p>
          </div>
          <div style={{minWidth:200}}>
            <div className="row-between" style={{marginBottom:6}}>
              <span className="dim" style={{fontSize:12, fontWeight:600}}>완료</span>
              <span className="num" style={{fontSize:14, fontWeight:700}}>{doneCount} / {tasks.length}</span>
            </div>
            <div className="progress-bar"><div style={{width: `${pct}%`}}></div></div>
          </div>
        </div>

        {/* 컨트롤 바: 항목 추가 + 다운로드 */}
        <div className="card card-lg" style={{marginBottom:24}}>
          <div className="row gap-10" style={{flexWrap:'wrap', alignItems:'flex-end'}}>
            <div className="field" style={{flex:'2 1 240px'}}>
              <label style={{fontSize:12, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:6}}>할 일 추가</label>
              <input
                type="text"
                placeholder="예: 우편물 이전 신청 / 사전점검 방문"
                value={newTitle}
                onChange={e=>setNewTitle(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter') addTask();}}
              />
            </div>
            <div className="field" style={{width:130}}>
              <label style={{fontSize:12, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:6}}>시점</label>
              <select value={newWhen} onChange={e=>setNewWhen(+e.target.value)}>
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
            <div className="field" style={{width:120}}>
              <label style={{fontSize:12, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:6}}>카테고리</label>
              <select value={newCat} onChange={e=>setNewCat(e.target.value)}>
                <option>점검</option><option>인테리어</option><option>시공</option>
                <option>청소</option><option>예약</option><option>통신</option>
                <option>공과금</option><option>가전</option><option>관리</option>
                <option>잔금</option><option>이사</option><option>행정</option><option>세금</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={addTask}><Icon.Plus /> 추가</button>
          </div>

          <div className="row gap-6" style={{flexWrap:'wrap', marginTop:14, paddingTop:14, borderTop:'1px solid var(--border)'}}>
            <span style={{fontSize:12, fontWeight:600, color:'var(--text-2)', alignSelf:'center', marginRight:4}}>📥 다운로드:</span>
            <button className="btn btn-primary btn-sm" onClick={exportCSV} title="엑셀에서 열기">
              <Icon.Download size={12} /> CSV
            </button>
            <button className="btn btn-sm" onClick={exportICS} title="구글캘린더·아이폰에 등록">
              <Icon.Calendar size={12} /> 캘린더(ICS)
            </button>
            <button className="btn btn-ghost btn-sm" onClick={exportTXT} title="텍스트로 받기">
              <Icon.Doc size={12} /> TXT
            </button>
            <span style={{flex:1}}></span>
            <button className="btn btn-ghost btn-sm" onClick={resetAll} title="기본 추천으로 초기화" style={{color:'#dc2626'}}>
              <Icon.Close size={12} /> 기본값으로 초기화
            </button>
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
