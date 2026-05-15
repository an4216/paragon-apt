// 이사 일정 플래너
function MovingPlanner({ ddayDate }) {
  const TEMPLATE = [
    { id: 't1', when: -45, title: '이사업체 3곳 견적 비교', cat: '예약', def: true },
    { id: 't2', when: -30, title: '입주청소 업체 예약', cat: '예약', def: true },
    { id: 't3', when: -28, title: '사전점검 방문 (체크리스트 지참)', cat: '점검', def: true },
    { id: 't4', when: -21, title: '인터넷·TV 이전 신청', cat: '통신', def: true },
    { id: 't5', when: -14, title: '도시가스 전출/전입 예약', cat: '공과금', def: true },
    { id: 't6', when: -14, title: '가전 (에어컨/세탁기) 이전 설치 예약', cat: '가전', def: true },
    { id: 't7', when: -10, title: '엘리베이터 사용 신청', cat: '관리', def: true },
    { id: 't8', when: -7, title: '잔금 납부 + 키 수령', cat: '잔금', def: true },
    { id: 't9', when: -3, title: '이삿짐 정리 / 폐기물 신고', cat: '정리', def: true },
    { id: 't10', when: 0, title: '이사 당일 — 엘리베이터 시간 확인', cat: '이사', def: true },
    { id: 't11', when: 1, title: '입주청소 + 가전 설치 입회', cat: '입주', def: true },
    { id: 't12', when: 5, title: '전입신고 + 확정일자 (정부24)', cat: '행정', def: true },
    { id: 't13', when: 14, title: '자동차 주소 변경 (위택스)', cat: '행정', def: true },
    { id: 't14', when: 30, title: '취득세 납부 / 등기 신청', cat: '세금', def: true },
  ];

  const [tasks, setTasks] = React.useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('jcp-mover') || 'null');
      if (saved && Array.isArray(saved)) return saved;
    } catch {}
    return TEMPLATE.map(t => ({...t, done:false}));
  });

  React.useEffect(() => {
    localStorage.setItem('jcp-mover', JSON.stringify(tasks));
  }, [tasks]);

  const [newTitle, setNewTitle] = React.useState('');
  const [newWhen, setNewWhen] = React.useState(-7);

  const addTask = () => {
    if (!newTitle.trim()) return;
    const id = 'u' + Date.now();
    setTasks([...tasks, { id, when: newWhen, title: newTitle.trim(), cat: '사용자', done: false }]);
    setNewTitle('');
  };

  const toggle = (id) => setTasks(tasks.map(t => t.id===id ? {...t, done:!t.done} : t));
  const remove = (id) => setTasks(tasks.filter(t => t.id !== id));

  const dateLabel = (offset) => {
    if (!ddayDate) return offset === 0 ? '입주일' : offset > 0 ? `D+${offset}` : `D${offset}`;
    const d = new Date(ddayDate);
    d.setDate(d.getDate() + offset);
    return `${d.getMonth()+1}/${d.getDate()} · ${offset===0?'D':offset>0?`D+${offset}`:`D${offset}`}`;
  };

  // group by week
  const sorted = [...tasks].sort((a,b)=> a.when - b.when);
  const groups = {
    before: sorted.filter(t => t.when < -7),
    week: sorted.filter(t => t.when >= -7 && t.when <= 0),
    after: sorted.filter(t => t.when > 0),
  };

  const doneCount = tasks.filter(t=>t.done).length;
  const pct = Math.round((doneCount / tasks.length) * 100);

  return (
    <section id="mover" className="section">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">SECTION 04 — 이사 플래너</span>
            <h2 className="section-title">내 일정에 맞춘 이사 계획</h2>
            <p className="section-sub">입주일 기준 D-Day로 자동 정렬. 항목을 추가하거나 체크하세요.</p>
          </div>
          <div style={{minWidth:200}}>
            <div className="row-between" style={{marginBottom:6}}>
              <span className="dim" style={{fontSize:12, fontWeight:600}}>완료</span>
              <span className="num" style={{fontSize:14, fontWeight:700}}>{doneCount} / {tasks.length}</span>
            </div>
            <div className="progress-bar"><div style={{width: `${pct}%`}}></div></div>
          </div>
        </div>

        <div className="card card-lg" style={{marginBottom:24}}>
          <div className="row gap-10" style={{flexWrap:'wrap'}}>
            <div className="field" style={{flex:2, minWidth:220}}>
              <input
                type="text"
                placeholder="할 일 추가 (예: 우편물 이전 신청)"
                value={newTitle}
                onChange={e=>setNewTitle(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter') addTask();}}
              />
            </div>
            <div className="field" style={{width:140}}>
              <select value={newWhen} onChange={e=>setNewWhen(+e.target.value)}>
                <option value={-60}>D-60 (2달 전)</option>
                <option value={-30}>D-30 (1달 전)</option>
                <option value={-14}>D-14 (2주 전)</option>
                <option value={-7}>D-7 (1주 전)</option>
                <option value={-3}>D-3 (3일 전)</option>
                <option value={0}>D-Day (입주일)</option>
                <option value={7}>D+7 (입주 후 1주)</option>
                <option value={30}>D+30 (입주 후 1달)</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={addTask}><Icon.Plus /> 추가</button>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:20}}>
          <PlannerColumn title="입주 전 (D-8 이전)" sub={`${groups.before.length}개`} tasks={groups.before} dateLabel={dateLabel} onToggle={toggle} onRemove={remove} />
          <PlannerColumn title="입주 주간 (D-7 ~ D)" sub={`${groups.week.length}개`} tasks={groups.week} dateLabel={dateLabel} onToggle={toggle} onRemove={remove} highlight />
          <PlannerColumn title="입주 후 (D+1 이후)" sub={`${groups.after.length}개`} tasks={groups.after} dateLabel={dateLabel} onToggle={toggle} onRemove={remove} />
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

window.MovingPlanner = MovingPlanner;
