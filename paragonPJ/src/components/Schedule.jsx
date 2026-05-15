// 내 입주 타임라인 만들기 — 사용자 맞춤 시공·청소·입주 일정 빌더 + 다운로드
function Schedule() {
  // 추천 항목 라이브러리 (입주청소·줄눈·인테리어 등 시공 중심)
  const LIBRARY = [
    { id: 'lib_pre',     title: '사전점검 방문',           cat: '점검',     offset: -30, dur: 1, desc: '하자 체크리스트 지참, 가족·전문업체 동반 가능' },
    { id: 'lib_interior',title: '인테리어 상담/계약',       cat: '인테리어', offset: -60, dur: 1, desc: '필름·도배·마루·조명 견적, 최소 3곳 비교' },
    { id: 'lib_film',    title: '필름 시공',               cat: '인테리어', offset: -15, dur: 2, desc: '주방·욕실 등 필름 작업 (보통 2일)' },
    { id: 'lib_wall',    title: '도배 시공',               cat: '인테리어', offset: -12, dur: 2, desc: '실크/합지 선택, 가구 들이기 전 완료' },
    { id: 'lib_floor',   title: '마루 시공',               cat: '인테리어', offset: -10, dur: 2, desc: '강마루/원목 등, 도배 후 진행' },
    { id: 'lib_aircon',  title: '시스템 에어컨 설치',       cat: '시공',     offset: -7,  dur: 1, desc: '인테리어 시공 마무리 단계' },
    { id: 'lib_paid',    title: '잔금 납부 + 키 수령',       cat: '입주',     offset: 0,   dur: 1, desc: '관리사무소에서 출입카드·도어락 비번 안내' },
    { id: 'lib_clean',   title: '입주청소',                cat: '청소',     offset: 0,   dur: 1, desc: '키 수령 직후, 가구 들이기 전 (보통 5~8만/평)' },
    { id: 'lib_joint',   title: '줄눈 시공',               cat: '시공',     offset: 1,   dur: 1, desc: '입주청소 다음 날 권장, 욕실·주방 타일 줄눈' },
    { id: 'lib_coat',    title: '나노·유리막 코팅',         cat: '시공',     offset: 1,   dur: 1, desc: '욕실·싱크대 발수 코팅, 줄눈 후 동시 진행 가능' },
    { id: 'lib_furn',    title: '가구·가전 배치',          cat: '입주',     offset: 2,   dur: 1, desc: '시공 마감 후 가구·가전 입고' },
    { id: 'lib_move',    title: '이사',                    cat: '입주',     offset: 3,   dur: 1, desc: '엘리베이터 예약 필수, 입주 지정기간 내 권장' },
    { id: 'lib_check',   title: '입주 후 마감 점검',        cat: '점검',     offset: 5,   dur: 1, desc: '시공·청소 마감 상태 최종 확인, 하자 추가 접수' },
    { id: 'lib_reg',     title: '전입신고 + 확정일자',       cat: '행정',     offset: 5,   dur: 1, desc: '입주 후 14일 이내, 정부24 또는 주민센터' },
    { id: 'lib_tax',     title: '취득세 납부 / 등기',        cat: '행정',     offset: 30,  dur: 1, desc: '잔금일로부터 60일 이내, 법무사 위임 가능' },
  ];

  const STORAGE_KEY = 'jcp-timeline-v2';
  // 입주 최초예정일 2025.12.31 (계약상 / 모집공고 2022000222)
  const INITIAL_MOVE_DATE = '2025-12-31';
  const [moveDate, setMoveDate] = React.useState(() => {
    try { return localStorage.getItem(STORAGE_KEY + ':date') || INITIAL_MOVE_DATE; } catch { return INITIAL_MOVE_DATE; }
  });
  const [items, setItems] = React.useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (Array.isArray(saved)) return saved;
    } catch {}
    // 기본 추천 선택: 핵심 항목 자동 추가
    return ['lib_pre','lib_paid','lib_clean','lib_joint','lib_move','lib_reg']
      .map(id => LIBRARY.find(l => l.id === id))
      .map(l => ({ ...l, id: 'u' + Math.random().toString(36).slice(2,8), libId: l.id, done: false }));
  });

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem(STORAGE_KEY + ':date', moveDate);
  }, [items, moveDate]);

  const addFromLibrary = (lib) => {
    setItems([...items, { ...lib, id: 'u' + Math.random().toString(36).slice(2,8), libId: lib.id, done: false }]);
  };
  const removeItem = (id) => setItems(items.filter(it => it.id !== id));
  const toggleItem = (id) => setItems(items.map(it => it.id === id ? { ...it, done: !it.done } : it));
  const updateOffset = (id, offset) => setItems(items.map(it => it.id === id ? { ...it, offset: +offset } : it));

  const [customTitle, setCustomTitle] = React.useState('');
  const [customOffset, setCustomOffset] = React.useState(0);
  const [customCat, setCustomCat] = React.useState('시공');
  const addCustom = () => {
    if (!customTitle.trim()) return;
    setItems([...items, {
      id: 'u' + Math.random().toString(36).slice(2,8),
      libId: null,
      title: customTitle.trim(),
      cat: customCat,
      offset: +customOffset,
      dur: 1,
      desc: '',
      done: false,
    }]);
    setCustomTitle('');
  };

  // 입주일 기준 실제 날짜 계산
  const dateFor = (offset) => {
    if (!moveDate) return null;
    const d = new Date(moveDate);
    d.setDate(d.getDate() + offset);
    return d;
  };
  const labelFor = (offset) => {
    const d = dateFor(offset);
    const dday = offset === 0 ? 'D-Day' : offset > 0 ? `D+${offset}` : `D${offset}`;
    return d ? `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} · ${dday}` : dday;
  };

  // 날짜순 정렬
  const sorted = [...items].sort((a, b) => a.offset - b.offset);
  const doneCount = items.filter(i => i.done).length;
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  // 라이브러리에서 이미 추가된 ID 추적
  const usedLibIds = new Set(items.map(i => i.libId).filter(Boolean));

  // ─────── 다운로드 ───────
  const downloadFile = (filename, content, mime = 'text/plain;charset=utf-8') => {
    const blob = new Blob(['﻿' + content], { type: mime }); // BOM for 엑셀 한글 깨짐 방지
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
    const head = ['순서','D-Day','날짜','카테고리','항목','메모','완료'];
    const rows = sorted.map((it, i) => {
      const d = dateFor(it.offset);
      const dateStr = d ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` : '';
      const dday = it.offset === 0 ? 'D-Day' : it.offset > 0 ? `D+${it.offset}` : `D${it.offset}`;
      const esc = (s) => `"${String(s||'').replace(/"/g,'""')}"`;
      return [i+1, dday, dateStr, it.cat, it.title, it.desc, it.done?'Y':'N'].map(esc).join(',');
    });
    const csv = [head.map(h=>`"${h}"`).join(','), ...rows].join('\r\n');
    downloadFile('주안센트럴파라곤_입주타임라인.csv', csv, 'text/csv;charset=utf-8');
  };

  const exportTXT = () => {
    const lines = [
      '주안센트럴파라곤 — 내 입주 타임라인',
      moveDate ? `입주 예정일: ${moveDate}` : '입주 예정일: 미정',
      `생성일: ${new Date().toISOString().slice(0,10)}`,
      `진행률: ${doneCount} / ${items.length} (${pct}%)`,
      '─'.repeat(50),
      '',
    ];
    sorted.forEach((it, i) => {
      lines.push(`${String(i+1).padStart(2,'0')}. [${it.done?'✓':' '}] ${labelFor(it.offset)}`);
      lines.push(`    [${it.cat}] ${it.title}`);
      if (it.desc) lines.push(`    ${it.desc}`);
      lines.push('');
    });
    downloadFile('주안센트럴파라곤_입주타임라인.txt', lines.join('\r\n'));
  };

  const exportICS = () => {
    if (!moveDate) {
      alert('캘린더(ICS) 형식으로 받으려면 입주 예정일을 먼저 입력해주세요.');
      return;
    }
    const pad = (n) => String(n).padStart(2,'0');
    const fmtICSDate = (d) => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
    const now = new Date();
    const stamp = `${fmtICSDate(now)}T${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}Z`;
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//JCParagon//Move-in Timeline//KO',
      'CALSCALE:GREGORIAN',
    ];
    sorted.forEach(it => {
      const start = dateFor(it.offset);
      const end = dateFor(it.offset + (it.dur || 1));
      ics.push('BEGIN:VEVENT');
      ics.push(`UID:${it.id}@jcparagon`);
      ics.push(`DTSTAMP:${stamp}`);
      ics.push(`DTSTART;VALUE=DATE:${fmtICSDate(start)}`);
      ics.push(`DTEND;VALUE=DATE:${fmtICSDate(end)}`);
      ics.push(`SUMMARY:[${it.cat}] ${it.title}`);
      if (it.desc) ics.push(`DESCRIPTION:${it.desc.replace(/\n/g,'\\n')}`);
      ics.push('END:VEVENT');
    });
    ics.push('END:VCALENDAR');
    downloadFile('주안센트럴파라곤_입주타임라인.ics', ics.join('\r\n'), 'text/calendar;charset=utf-8');
  };

  const resetAll = () => {
    if (!confirm('타임라인을 초기화할까요? 추가/수정한 모든 항목이 삭제됩니다.')) return;
    setItems([]);
  };

  // 카테고리 색상
  const catColor = (cat) => ({
    '점검': '#2563eb',
    '인테리어': '#9333ea',
    '시공': '#ea580c',
    '청소': '#0891b2',
    '입주': '#dc2626',
    '행정': '#65a30d',
  })[cat] || '#737373';

  return (
    <section id="schedule" className="section">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">SECTION 02 — 나만의 타임라인</span>
            <h2 className="section-title">내 입주 타임라인 만들기</h2>
            <p className="section-sub">사전점검 · 인테리어 · 입주청소 · 줄눈 · 이사까지 — 내 일정에 맞게 짜고 다운로드.</p>
          </div>
          <div style={{minWidth:200}}>
            <div className="row-between" style={{marginBottom:6}}>
              <span className="dim" style={{fontSize:12, fontWeight:600}}>완료</span>
              <span className="num" style={{fontSize:14, fontWeight:700}}>{doneCount} / {items.length}</span>
            </div>
            <div className="progress-bar"><div style={{width: `${pct}%`}}></div></div>
          </div>
        </div>

        {/* 입주일 + 다운로드 컨트롤 바 */}
        <div className="card card-lg" style={{marginBottom:24, padding:20}}>
          <div className="row gap-10" style={{flexWrap:'wrap', alignItems:'flex-end'}}>
            <div className="field" style={{minWidth:220}}>
              <label style={{fontSize:12, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:6}}>입주 예정일 (D-Day)</label>
              <input
                type="date"
                value={moveDate}
                onChange={e=>setMoveDate(e.target.value)}
                style={{padding:'8px 10px', borderRadius:8, border:'1px solid var(--border)', background:'var(--surface)', fontSize:14, fontFamily:'inherit'}}
              />
            </div>
            <div style={{flex:1, minWidth:200}}>
              {!moveDate && <div className="dim" style={{fontSize:12}}>입주일을 입력하면 각 항목의 실제 날짜가 자동 계산됩니다.</div>}
              {moveDate && <div className="dim" style={{fontSize:12}}>입주일 기준 자동 정렬됨. 각 항목의 D-Day를 직접 수정할 수 있어요.</div>}
            </div>
            <div className="row gap-6" style={{flexWrap:'wrap'}}>
              <button className="btn btn-primary btn-sm" onClick={exportCSV} title="엑셀에서 열기">
                <Icon.Download size={12} /> CSV
              </button>
              <button className="btn btn-sm" onClick={exportICS} title="구글캘린더·아이폰에 등록">
                <Icon.Calendar size={12} /> 캘린더(ICS)
              </button>
              <button className="btn btn-ghost btn-sm" onClick={exportTXT} title="텍스트로 받기">
                <Icon.Doc size={12} /> TXT
              </button>
              <button className="btn btn-ghost btn-sm" onClick={resetAll} title="전체 초기화" style={{color:'#dc2626'}}>
                <Icon.Close size={12} /> 초기화
              </button>
            </div>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:24}} className="schedule-grid">
          {/* 좌: 추천 항목 라이브러리 */}
          <div>
            <h3 style={{fontSize:15, fontWeight:700, margin:'0 0 14px'}}>📚 추천 항목 (클릭해서 추가)</h3>
            <div className="card card-lg" style={{padding:14}}>
              <div style={{display:'flex', flexDirection:'column', gap:8}}>
                {LIBRARY.map(lib => {
                  const used = usedLibIds.has(lib.id);
                  return (
                    <button
                      key={lib.id}
                      onClick={()=>!used && addFromLibrary(lib)}
                      disabled={used}
                      style={{
                        textAlign:'left',
                        padding:'10px 12px',
                        borderRadius:8,
                        border:'1px solid var(--border)',
                        background: used ? 'var(--bg)' : 'var(--surface)',
                        cursor: used ? 'not-allowed' : 'pointer',
                        opacity: used ? 0.45 : 1,
                        fontFamily:'inherit',
                      }}>
                      <div className="row-between">
                        <div className="row gap-8" style={{alignItems:'center'}}>
                          <span style={{display:'inline-block', width:6, height:6, borderRadius:'50%', background:catColor(lib.cat)}}></span>
                          <span style={{fontSize:13.5, fontWeight:600, color:'var(--text-1)'}}>{lib.title}</span>
                        </div>
                        <span style={{fontSize:11, fontWeight:700, color:catColor(lib.cat)}}>
                          {lib.offset === 0 ? 'D-Day' : lib.offset > 0 ? `D+${lib.offset}` : `D${lib.offset}`}
                        </span>
                      </div>
                      <div className="dim" style={{fontSize:11.5, marginTop:4, lineHeight:1.4}}>{lib.desc}</div>
                      {used && <div style={{fontSize:10.5, marginTop:4, color:'var(--accent-text, #ea580c)', fontWeight:600}}>✓ 추가됨</div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 직접 추가 */}
            <div className="card card-lg" style={{padding:14, marginTop:14}}>
              <div style={{fontSize:13, fontWeight:700, marginBottom:10}}>+ 직접 항목 추가</div>
              <div className="row gap-6" style={{flexWrap:'wrap'}}>
                <input
                  type="text"
                  placeholder="예: 베란다 누수 점검"
                  value={customTitle}
                  onChange={e=>setCustomTitle(e.target.value)}
                  onKeyDown={e=>{ if(e.key==='Enter') addCustom(); }}
                  style={{flex:'2 1 200px', padding:'7px 10px', borderRadius:6, border:'1px solid var(--border)', background:'var(--surface)', fontSize:13, fontFamily:'inherit'}}
                />
                <select
                  value={customCat}
                  onChange={e=>setCustomCat(e.target.value)}
                  style={{padding:'7px 8px', borderRadius:6, border:'1px solid var(--border)', background:'var(--surface)', fontSize:12.5, fontFamily:'inherit'}}>
                  <option>점검</option><option>인테리어</option><option>시공</option><option>청소</option><option>입주</option><option>행정</option>
                </select>
                <input
                  type="number"
                  value={customOffset}
                  onChange={e=>setCustomOffset(e.target.value)}
                  style={{width:70, padding:'7px 8px', borderRadius:6, border:'1px solid var(--border)', background:'var(--surface)', fontSize:12.5, fontFamily:'inherit'}}
                  title="입주일 기준 D-day (예: -7 = 입주 7일 전)"
                />
                <button className="btn btn-primary btn-sm" onClick={addCustom}><Icon.Plus size={12} /></button>
              </div>
              <div className="dim" style={{fontSize:11, marginTop:6}}>D-day는 입주일 기준 (- 입주 전 / 0 입주일 / + 입주 후)</div>
            </div>
          </div>

          {/* 우: 내 타임라인 */}
          <div>
            <h3 style={{fontSize:15, fontWeight:700, margin:'0 0 14px'}}>📅 내 타임라인 ({items.length}개)</h3>
            {items.length === 0 ? (
              <div className="card card-lg" style={{padding:40, textAlign:'center'}}>
                <div className="dim" style={{fontSize:14}}>좌측 추천 항목을 클릭하거나 직접 추가해보세요.</div>
              </div>
            ) : (
              <div className="timeline">
                {sorted.map((it, idx) => (
                  <div key={it.id} className={`tl-item ${it.done?'done':''}`}>
                    <div className="tl-dot" style={{background: it.done ? catColor(it.cat) : 'var(--surface)', borderColor: catColor(it.cat)}}>
                      {it.done && <Icon.Check size={11} color="white" />}
                    </div>
                    <div className="row-between" style={{gap:8, alignItems:'flex-start'}}>
                      <div style={{flex:1, minWidth:0}}>
                        <div className="tl-date" style={{color:catColor(it.cat)}}>
                          {labelFor(it.offset)} · {it.cat}
                        </div>
                        <div className="tl-title">{it.title}</div>
                        {it.desc && <div className="tl-desc">{it.desc}</div>}
                        <div className="row gap-6" style={{marginTop:6, alignItems:'center'}}>
                          <label style={{fontSize:11, color:'var(--text-2)'}}>D-day:</label>
                          <input
                            type="number"
                            value={it.offset}
                            onChange={e=>updateOffset(it.id, e.target.value)}
                            style={{width:60, padding:'3px 6px', borderRadius:5, border:'1px solid var(--border)', background:'var(--surface)', fontSize:11.5, fontFamily:'inherit'}}
                          />
                        </div>
                      </div>
                      <div className="row gap-6" style={{flexShrink:0}}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={()=>toggleItem(it.id)}
                          title={it.done?'미완료로 변경':'완료 표시'}
                          style={{padding:'4px 8px'}}>
                          <Icon.Check size={12} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={()=>removeItem(it.id)}
                          title="삭제"
                          style={{padding:'4px 8px'}}>
                          <Icon.Close size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
window.Schedule = Schedule;
