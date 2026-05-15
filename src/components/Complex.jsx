// 단지 정보 / 평면도 / 단지 스펙 — PNG 평면도(7타입) 매칭
function Complex() {
  const [tab, setTab] = React.useState('plan');
  const [planModal, setPlanModal] = React.useState(null);

  // PNG 파일과 1:1 매칭되는 7개 타입
  // 이미지: /assets/plans/{file}
  // 출처: 분양24 모집공고 2022000222 (주안 센트럴 파라곤, 2022.05.23~26)
  const plans = [
    {
      id: '51A', file: '51m2A.PNG', name: '51A 타입',
      area: '전용 51.9788㎡', supply: '공급 70.5304㎡',
      rooms: '방2 · 욕실1', priceK: 32930,
      layout: ['안방','침실2','거실','주방','욕실','현관','드레스룸'],
    },
    {
      id: '51B', file: '51m2B.PNG', name: '51B 타입',
      area: '전용 51.5988㎡', supply: '공급 70.8297㎡',
      rooms: '방3 · 욕실1', priceK: 32780,
      layout: ['안방','침실1','침실2','거실','주방','욕실1','현관','트레스룸'],
    },
    {
      id: '59',  file: '59m2.PNG',  name: '59 타입',
      area: '전용 59.9600㎡', supply: '공급 82.5224㎡',
      rooms: '방3 · 욕실1', priceK: 41530,
      layout: ['안방','침실1','침실2','거실','주방','욕실1','드레스룸','발코니','현관'],
    },
    {
      id: '62A', file: '62m2A.PNG', name: '62A 타입',
      area: '전용 62.9017㎡', supply: '공급 86.3776㎡',
      rooms: '방3 · 욕실2', priceK: 43140,
      layout: ['안방','침실1','침실2','거실','주방','욕실','발코니','드레스룸','현관'],
    },
    {
      id: '62B', file: '62m2B.PNG', name: '62B 타입',
      area: '전용 62.9977㎡', supply: '공급 86.6771㎡',
      rooms: '방3 · 욕실2', priceK: 42800,
      layout: ['안방','침실1','침실2','거실','주방','욕실','드레스룸','현관'],
    },
    {
      id: '76',  file: '76m2.PNG',  name: '76 타입',
      area: '전용 76.6893㎡', supply: '공급 104.0480㎡',
      rooms: '방3 · 욕실2', priceK: 50570,
      layout: ['안방','침실1','침실2','거실','주방','욕실','드레스룸','현관'],
    },
    {
      id: '84',  file: '84m2.PNG',  name: '84 타입',
      area: '전용 84.6823㎡', supply: '공급 114.4730㎡',
      rooms: '방3 · 욕실2', priceK: 57940,
      layout: ['안방','침실2','거실','주방','욕실','드레스룸','현관'],
    },
  ];

  return (
    <section id="complex" className="section">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">SECTION 01 — 단지 정보</span>
            <h2 className="section-title">101~112동, 한눈에 보기</h2>
            <p className="section-sub">내 동·호수와 평면도, 단지 구성을 확인하세요. 평면도는 모집공고 기준 7종.</p>
          </div>
          <div className="tabs hide-mobile">
            <button className={tab==='plan'?'active':''} onClick={()=>setTab('plan')}>평면도</button>
            <button className={tab==='spec'?'active':''} onClick={()=>setTab('spec')}>단지 스펙</button>
          </div>
        </div>

        {/* mobile tabs — 콘텐츠 위에 배치하여 즉시 탐색 가능 */}
        <div className="show-mobile" style={{marginBottom:16}}>
          <div className="tabs" style={{display:'flex', width:'100%'}}>
            <button style={{flex:1}} className={tab==='plan'?'active':''} onClick={()=>setTab('plan')}>평면도</button>
            <button style={{flex:1}} className={tab==='spec'?'active':''} onClick={()=>setTab('spec')}>스펙</button>
          </div>
        </div>

        {tab === 'plan' && (
          <div className="plan-grid">
            {plans.map(p => (
              <div key={p.id} className="plan-card" onClick={()=>setPlanModal(p)}>
                <div className="plan-thumb">
                  <img className="fp-img" src={`assets/plans/${p.file}`} alt={`${p.name} 평면도`} loading="lazy" />
                  <span className="chip chip-accent plan-type-chip">{p.id}</span>
                </div>
                <div className="plan-body">
                  <h3 className="name">{p.name}</h3>
                  <div className="area">{p.area} · {p.supply}</div>
                  <div className="specs">
                    <span className="chip">{p.rooms}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'spec' && (
          <div className="plan-grid">
            <SpecCard k="총 동수" v="12개동" sub="지하 2층 ~ 지상 최고 40층" />
            <SpecCard k="평면 타입" v="7종" sub="51A · 51B · 59 · 62A · 62B · 76 · 84" />
            <SpecCard k="시공사" v="라인건설" sub="주안 센트럴 파라곤 브랜드" />
            <SpecCard k="위치" v="인천시 미추홀구 주안동" sub="590-22번지" />
            <SpecCard k="부대시설" v="경로당 · 작은도서관" sub="어린이놀이터 · 티하우스 · 주민운동시설" />
            <SpecCard k="분양 시기" v="2022.05" sub="모집공고 2022.05.23~26" />
          </div>
        )}

        {planModal && <PlanModal plan={planModal} onClose={()=>setPlanModal(null)} />}
      </div>
    </section>
  );
}

function SpecCard({ k, v, sub }) {
  return (
    <div className="card">
      <div style={{fontSize:12, color:'var(--text-3)', fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase'}}>{k}</div>
      <div style={{fontSize:22, fontWeight:700, letterSpacing:'-.02em', margin:'6px 0 4px'}}>{v}</div>
      <div style={{fontSize:13, color:'var(--text-2)'}}>{sub}</div>
    </div>
  );
}

function PlanModal({ plan, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="muted" style={{fontSize:12, fontWeight:600, letterSpacing:'.04em'}}>{plan.id}</div>
            <h3>{plan.name}</h3>
            <div className="muted" style={{fontSize:13, marginTop:4}}>{plan.area} · {plan.supply}</div>
          </div>
          <button className="modal-close" onClick={onClose}><Icon.Close /></button>
        </div>
        <div className="modal-body">
          <div style={{background:'var(--surface-2)', borderRadius:12, padding:24, display:'grid', placeItems:'center', border:'1px solid var(--border)'}}>
            <img
              src={`assets/plans/${plan.file}`}
              alt={`${plan.name} 평면도`}
              style={{maxWidth:'100%', maxHeight:'48vh', height:'auto', display:'block'}}
            />
          </div>
          {plan.layout && (
            <div style={{display:'flex', flexWrap:'wrap', gap:6, marginTop:14}}>
              {plan.layout.map(room => (
                <span key={room} className="chip">{room}</span>
              ))}
            </div>
          )}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:20}}>
            <div>
              <div className="dim" style={{fontSize:11.5, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase'}}>방·욕실</div>
              <div style={{fontSize:16, fontWeight:700, marginTop:4}}>{plan.rooms}</div>
            </div>
            <div>
              <div className="dim" style={{fontSize:11.5, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase'}}>최초 분양가</div>
              <div style={{fontSize:16, fontWeight:700, marginTop:4}}>{fmt.eok(plan.priceK * 10000)}원~</div>
            </div>
            <div>
              <div className="dim" style={{fontSize:11.5, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase'}}>옵션</div>
              <div style={{fontSize:16, fontWeight:700, marginTop:4}}>5종 선택 가능</div>
            </div>
            <div>
              <div className="dim" style={{fontSize:11.5, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase'}}>면적</div>
              <div style={{fontSize:16, fontWeight:700, marginTop:4}}>{plan.area.replace('전용 ','')}</div>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" style={{marginTop:24, width:'100%', justifyContent:'center'}} onClick={onClose}>
            <Icon.Download /> 평면도 PDF 다운로드
          </button>
        </div>
      </div>
    </div>
  );
}

window.Complex = Complex;
