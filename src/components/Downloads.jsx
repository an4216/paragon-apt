// 자료실 (다운로드)
function Downloads() {
  const files = [
    { cat: '평면도', name: '51A 타입 평면도 (전용 51.9788㎡)', size: '85 KB',  ext: 'PNG', date: '2022.05.23', href: 'assets/plans/51m2A.PNG' },
    { cat: '평면도', name: '51B 타입 평면도 (전용 51.5988㎡)', size: '85 KB',  ext: 'PNG', date: '2022.05.23', href: 'assets/plans/51m2B.PNG' },
    { cat: '평면도', name: '59 타입 평면도 (전용 59.96㎡)',     size: '97 KB',  ext: 'PNG', date: '2022.05.23', href: 'assets/plans/59m2.PNG'  },
    { cat: '평면도', name: '62A 타입 평면도 (전용 62.9017㎡)', size: '97 KB',  ext: 'PNG', date: '2022.05.23', href: 'assets/plans/62m2A.PNG' },
    { cat: '평면도', name: '62B 타입 평면도 (전용 62.9977㎡)', size: '83 KB',  ext: 'PNG', date: '2022.05.23', href: 'assets/plans/62m2B.PNG' },
    { cat: '평면도', name: '76 타입 평면도 (전용 76.6893㎡)',   size: '98 KB',  ext: 'PNG', date: '2022.05.23', href: 'assets/plans/76m2.PNG'  },
    { cat: '평면도', name: '84 타입 평면도 (전용 84.6823㎡)',   size: '111 KB', ext: 'PNG', date: '2022.05.23', href: 'assets/plans/84m2.PNG'  },
    { cat: '공고문', name: '입주자 모집공고 (2022000222)', size: '3.4 MB', ext: 'PDF', date: '2022.05.23' },
    { cat: '공고문', name: '분양계약서 (표준)',           size: '892 KB', ext: 'PDF', date: '2022.05.26' },
    { cat: '공고문', name: '입주 예정 안내문 (변경)',     size: '720 KB', ext: 'PDF', date: '2026.03.31' },
    { cat: '서류', name: '취득세 신고 안내',               size: '320 KB', ext: 'PDF', date: '2026.03.01' },
    { cat: '서류', name: '전입신고 + 확정일자 가이드',     size: '480 KB', ext: 'PDF', date: '2026.03.01' },
  ];

  const [filter, setFilter] = React.useState('전체');
  const cats = ['전체', ...Array.from(new Set(files.map(f => f.cat)))];
  const visible = filter === '전체' ? files : files.filter(f => f.cat === filter);

  return (
    <section id="downloads" className="section">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">SECTION 05 — 자료실</span>
            <h2 className="section-title">필요한 서류, 한 번에 받기</h2>
            <p className="section-sub">평면도 · 공고문 · 서류 양식까지. 모두 무료 다운로드.</p>
          </div>
          <div className="row gap-6" style={{flexWrap:'wrap'}}>
            {cats.map(c => (
              <button
                key={c}
                className={`chip ${filter===c?'chip-accent':''}`}
                style={{cursor:'pointer', border: filter===c?'none':'1px solid var(--border)'}}
                onClick={()=>setFilter(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="dl-grid">
          {visible.map((f, i) => {
            const hasFile = !!f.href;
            return (
              <a
                key={i}
                className="dl-item"
                href={hasFile ? f.href : '#'}
                {...(hasFile ? { download: '', target: '_blank', rel: 'noopener' } : { onClick: e=>e.preventDefault() })}>
                <div className="dl-icon">{f.ext}</div>
                <div className="dl-meta">
                  <div className="dl-name">{f.name}</div>
                  <div className="dl-info">
                    <span>{f.cat}</span>
                    <span>·</span>
                    <span>{f.size}</span>
                    <span>·</span>
                    <span>{f.date}</span>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" title={hasFile ? '다운로드' : '준비중'}>
                  <Icon.Download />
                </button>
              </a>
            );
          })}
        </div>

        <FAQ />
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: '입주 예정일은 언제 확정되나요?', a: '시공사 측에서 사용승인일이 확정되는 시점에 등기우편 및 본 홈페이지를 통해 공지됩니다. 통상 사용승인 약 1~2개월 전에 입주 지정기간이 안내됩니다.' },
    { q: '사전점검은 어떻게 진행되나요?', a: '입주 약 30일 전 3일간 진행되며, 입주자별 시간대를 사전 예약합니다. 가족, 전문 점검업체와 함께 방문 가능하며 발견된 하자는 시공사에 즉시 접수하여 입주 전 보수받을 수 있습니다.' },
    { q: '잔금 대출은 어디서 받을 수 있나요?', a: '시공사 협약은행 외에도 모든 시중은행 잔금대출이 가능합니다. 최소 3곳 이상 비교 견적을 권장하며, 입주 약 1~2개월 전 사전 상담을 받으시면 좋습니다.' },
    { q: '입주가 지연될 경우 지체상금을 받을 수 있나요?', a: '분양계약서상 입주 예정일을 시공사 귀책으로 초과한 경우 기납부액에 대한 연이율(통상 6.5~8%)을 일할 계산하여 청구할 수 있습니다. 본 사이트의 지연금 계산기로 예상 금액을 확인할 수 있습니다.' },
    { q: '평면도나 옵션 안내문이 분실되었어요.', a: '자료실에서 모든 평면도와 공고문, 입주 매뉴얼을 PDF로 받으실 수 있습니다. 분양 당시의 옵션 계약 내역은 시공사 입주센터로 직접 문의해주세요.' },
    { q: '이사 시 엘리베이터 사용은 어떻게 신청하나요?', a: '입주 약 10일 전부터 단지 관리사무소에서 사전 예약을 받습니다. 1동당 사다리차·엘리베이터 동시 사용 시간이 정해져 있어 조기 예약을 권장합니다.' },
  ];
  const [open, setOpen] = React.useState(null);

  return (
    <div style={{marginTop:56}}>
      <h2 className="section-title" style={{marginBottom:16}}>자주 묻는 질문</h2>
      <div className="card card-lg" style={{padding:0}}>
        {faqs.map((f, i) => (
          <div key={i} className={`faq-item ${open===i?'open':''}`} onClick={()=>setOpen(open===i ? null : i)}>
            <div className="faq-q">
              <div><span className="faq-q-marker">Q.</span> {f.q}</div>
              <Icon.ArrowD style={{transform: open===i ? 'rotate(180deg)' : 'rotate(0)', transition:'transform .2s'}} />
            </div>
            <div className="faq-a">{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-inner">
          <div>
            <div className="row gap-10" style={{marginBottom:14}}>
              <span className="nav-logo-mark" style={{width:32, height:32, borderRadius:9, fontSize:14}}>JC</span>
              <strong style={{fontSize:15, color:'var(--text-1)'}}>주안센트럴파라곤</strong>
            </div>
            <p className="muted" style={{fontSize:13, margin:'0 0 12px', maxWidth:340}}>
              입주 예정자를 위한 비공식 정보 페이지. 시공사 공식 공지를 보조하기 위한 목적으로 운영됩니다.
            </p>
            <span className="chip">비공식 · 입주 예정자 모임</span>
          </div>
          <div>
            <h4>바로가기</h4>
            <ul>
              <li><a href="#schedule">입주·이사 일정</a></li>
              <li><a href="#calc">계산기</a></li>
              <li><a href="#downloads">자료실</a></li>
            </ul>
          </div>
          <div>
            <h4>문의처</h4>
            <ul>
              <li>시공사: 라인건설</li>
              <li>인천 미추홀구 경인북길357번길 6</li>
              <li>(주안2동 590-22번지 일원)</li>
            </ul>
          </div>
          <div>
            <h4>외부 링크</h4>
            <ul>
              <li>국토교통부 청약 Home</li>
              <li>정부24 (전입신고)</li>
              <li>위택스 (취득세)</li>
              <li>한국부동산원</li>
            </ul>
          </div>
        </div>
        <div className="copy">
          <span>© 2026 주안센트럴파라곤 입주민 · 비공식</span>
          <span>본 페이지의 모든 일정·금액은 참고용입니다. 실제 일정은 시공사 공지를 따릅니다.</span>
        </div>
      </div>
    </footer>
  );
}

window.Downloads = Downloads;
window.Footer = Footer;
