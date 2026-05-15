// 계산기 — 대출금(보금자리론·집단대출·일반) / 입주지연금(xlsx 기반) / 중도금이자(xlsx 기반)
function Calculators() {
  const [tab, setTab] = React.useState('loan');
  return (
    <section id="calc" className="section">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">SECTION 03 — 계산기</span>
            <h2 className="section-title">숫자로 미리 확인하기</h2>
            <p className="section-sub">대출 한도·이자, 입주지연금, 중도금이자를 직접 계산해보세요.</p>
          </div>
          <div className="tabs">
            <button className={tab==='loan'?'active':''} onClick={()=>setTab('loan')}>대출금</button>
            <button className={tab==='delay'?'active':''} onClick={()=>setTab('delay')}>입주 지연금</button>
            <button className={tab==='interim'?'active':''} onClick={()=>setTab('interim')}>중도금 이자</button>
          </div>
        </div>

        {tab === 'loan' && <LoanCalc />}
        {tab === 'delay' && <DelayCalc />}
        {tab === 'interim' && <InterimCalc />}
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// 대출금 계산기 — 보금자리론 / 집단대출 / 일반
// ──────────────────────────────────────────────────────────
function LoanCalc() {
  // 대출 종류별 기본값 (보금자리론 2026년 1월 기준 4.0%, 집단대출 4.5%)
  const LOAN_PRESETS = {
    bogeumjari: { label: '보금자리론',  rate: 4.0, years: 30, method: 'equal',  defer: false, deferMonths: 0,  note: '한국주택금융공사(HF) 정책 고정금리. 거치 없음. 한도: 일반 3.6억/다자녀 4.0억/생애최초 4.2억 (LTV 70%).' },
    group:      { label: '집단대출',     rate: 4.5, years: 30, method: 'equal',  defer: false, deferMonths: 12, note: '시공사 협약은행 변동금리(COFIX 연동). 1년 거치 후 분할상환 일반적.' },
    general:    { label: '일반 주담대', rate: 4.2, years: 30, method: 'equal',  defer: false, deferMonths: 0,  note: '시중은행 주택담보대출. 금리·기간·상환방식을 자유롭게 설정.' },
  };

  const [type, setType] = React.useState('bogeumjari');
  const [principal, setPrincipal] = React.useState(30000); // 만원
  const [rate, setRate] = React.useState(LOAN_PRESETS.bogeumjari.rate);
  const [years, setYears] = React.useState(LOAN_PRESETS.bogeumjari.years);
  const [method, setMethod] = React.useState(LOAN_PRESETS.bogeumjari.method);
  const [defer, setDefer] = React.useState(false);
  const [deferMonths, setDeferMonths] = React.useState(12);

  // 대출 종류 변경 시 기본값 자동 반영
  const switchType = (t) => {
    setType(t);
    const p = LOAN_PRESETS[t];
    setRate(p.rate);
    setYears(p.years);
    setMethod(p.method);
    setDefer(p.defer);
    setDeferMonths(p.deferMonths);
  };

  const principalWon = principal * 10000;
  const monthlyRate = rate / 100 / 12;
  const totalMonths = years * 12;
  // 거치 적용: 집단대출만 거치 체크박스 노출. 거치 후 원금분할상환 기간 = 총기간 - 거치기간
  const deferM = (type === 'group' && defer) ? deferMonths : 0;
  const payMonths = totalMonths - deferM;

  const result = React.useMemo(() => {
    if (principalWon === 0 || totalMonths === 0) {
      return { monthly: 0, monthlyDefer: 0, total: 0, totalInterest: 0, firstMonth: 0, lastMonth: 0 };
    }

    // 거치기간 중 월 이자 (원금 그대로 × 월이율)
    const monthlyDefer = principalWon * monthlyRate;
    const deferInterest = monthlyDefer * deferM;

    if (method === 'equal') {
      // 원리금균등 (거치 후 잔존 원금을 payMonths에 걸쳐 균등 상환)
      const m = monthlyRate === 0
        ? principalWon / payMonths
        : principalWon * monthlyRate * Math.pow(1 + monthlyRate, payMonths) / (Math.pow(1 + monthlyRate, payMonths) - 1);
      const payTotal = m * payMonths;
      return {
        monthly: m,
        monthlyDefer,
        total: payTotal + deferInterest,
        totalInterest: payTotal - principalWon + deferInterest,
        firstMonth: deferM > 0 ? monthlyDefer : m,
        lastMonth: m,
      };
    }
    if (method === 'equalPrincipal') {
      // 원금균등 (거치 후 매월 원금 동일 + 잔액 이자)
      const monthlyPrincipal = principalWon / payMonths;
      const firstInterest = principalWon * monthlyRate;
      const lastInterest = monthlyPrincipal * monthlyRate;
      // 이자 합계: 원금균등은 잔액 평균이 (원금+원금/N)/2 ≈ 원금/2 가정 시 근사. 정확값 계산:
      let totInt = 0;
      for (let k = 0; k < payMonths; k++) {
        totInt += (principalWon - monthlyPrincipal * k) * monthlyRate;
      }
      return {
        monthly: monthlyPrincipal + firstInterest,
        monthlyDefer,
        total: principalWon + totInt + deferInterest,
        totalInterest: totInt + deferInterest,
        firstMonth: deferM > 0 ? monthlyDefer : (monthlyPrincipal + firstInterest),
        lastMonth: monthlyPrincipal + lastInterest,
      };
    }
    // 만기일시 (전 기간 이자만 + 만기 원금)
    const monthlyInt = principalWon * monthlyRate;
    return {
      monthly: monthlyInt,
      monthlyDefer,
      total: principalWon + monthlyInt * totalMonths,
      totalInterest: monthlyInt * totalMonths,
      firstMonth: monthlyInt,
      lastMonth: monthlyInt + principalWon,
    };
  }, [principalWon, monthlyRate, totalMonths, payMonths, deferM, method]);

  const preset = LOAN_PRESETS[type];

  return (
    <div className="card card-lg">
      {/* 대출 종류 선택 */}
      <div className="row gap-6" style={{flexWrap:'wrap', marginBottom:18}}>
        {Object.entries(LOAN_PRESETS).map(([k, v]) => (
          <button key={k}
            onClick={()=>switchType(k)}
            className={`chip ${type===k?'chip-accent':''}`}
            style={{cursor:'pointer', padding:'8px 14px', fontSize:13, fontWeight:600, border: type===k?'none':'1px solid var(--border)'}}>
            {v.label}
          </button>
        ))}
      </div>
      <div style={{padding:'10px 12px', background:'var(--accent-soft)', borderRadius:8, fontSize:12, color:'var(--accent-text)', marginBottom:18}}>
        ⓘ {preset.note}
      </div>

      <div className="calc-grid">
        <div className="col gap-16">
          <div className="field">
            <label>대출 원금 <span className="dim">(만원)</span></label>
            <div className="input-suffix">
              <input type="number" value={principal} onChange={e=>setPrincipal(+e.target.value || 0)} />
              <span>만원</span>
            </div>
            <div className="slider-row">
              <input type="range" min="0" max="80000" step="500" value={principal} onChange={e=>setPrincipal(+e.target.value)} />
              <div className="val">{fmt.eok(principal*10000)}</div>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>연 이자율 <span className="dim">{type==='bogeumjari'?'(고정)':type==='group'?'(변동, 초기)':'(연이율)'}</span></label>
              <div className="input-suffix">
                <input type="number" step="0.05" value={rate} onChange={e=>setRate(+e.target.value || 0)} />
                <span>%</span>
              </div>
              <div className="slider-row">
                <input type="range" min="2" max="8" step="0.05" value={rate} onChange={e=>setRate(+e.target.value)} />
                <div className="val">{rate.toFixed(2)}%</div>
              </div>
            </div>
            <div className="field">
              <label>상환 기간</label>
              <div className="input-suffix">
                <input type="number" value={years} onChange={e=>setYears(+e.target.value || 0)} />
                <span>년</span>
              </div>
              <div className="slider-row">
                <input type="range" min="5" max="40" step="1" value={years} onChange={e=>setYears(+e.target.value)} />
                <div className="val">{years}년</div>
              </div>
            </div>
          </div>

          <div className="field">
            <label>상환 방식</label>
            <div className="tabs" style={{display:'flex'}}>
              <button style={{flex:1}} className={method==='equal'?'active':''} onClick={()=>setMethod('equal')}>원리금균등</button>
              <button style={{flex:1}} className={method==='equalPrincipal'?'active':''} onClick={()=>setMethod('equalPrincipal')}>원금균등</button>
              <button style={{flex:1}} className={method==='bullet'?'active':''} onClick={()=>setMethod('bullet')} disabled={type==='bogeumjari'} title={type==='bogeumjari'?'보금자리론은 만기일시 불가':''}>만기일시</button>
            </div>
            <div className="field-hint">
              {method==='equal' && '매월 같은 금액을 납부 (원금+이자 합계 동일)'}
              {method==='equalPrincipal' && '원금은 매월 동일, 이자는 점점 감소 — 초기 부담이 큼'}
              {method==='bullet' && '매월 이자만 납부, 만기에 원금 일시 상환'}
            </div>
          </div>

          {/* 집단대출: 1년 거치 체크박스 */}
          {type === 'group' && (
            <div className="field" style={{padding:'12px 14px', background:'var(--surface)', border:'1px dashed var(--border-strong)', borderRadius:8}}>
              <label style={{display:'flex', alignItems:'center', gap:10, cursor:'pointer', fontWeight:600}}>
                <input
                  type="checkbox"
                  checked={defer}
                  onChange={e=>setDefer(e.target.checked)}
                  style={{width:18, height:18, cursor:'pointer'}}
                />
                <span>거치 적용 (이자만 납부)</span>
              </label>
              {defer && (
                <div style={{marginTop:10, paddingLeft:28}}>
                  <div className="row gap-8" style={{alignItems:'center'}}>
                    <label style={{fontSize:12, color:'var(--text-2)'}}>거치 기간:</label>
                    <select value={deferMonths} onChange={e=>setDeferMonths(+e.target.value)}
                      style={{padding:'6px 10px', borderRadius:6, border:'1px solid var(--border)', background:'var(--bg)', fontSize:13, fontFamily:'inherit'}}>
                      <option value={12}>1년 (12개월)</option>
                      <option value={24}>2년 (24개월)</option>
                      <option value={36}>3년 (36개월)</option>
                    </select>
                  </div>
                  <div className="field-hint" style={{marginTop:6}}>
                    거치 기간 중에는 매월 이자만 납부 → 거치 종료 후 잔존 원금을 {years - deferMonths/12}년에 걸쳐 {method==='equal'?'원리금균등':method==='equalPrincipal'?'원금균등':'만기일시'} 상환.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="calc-result">
          <div className="label">
            {deferM > 0 ? `거치기간 월 납부` : `월 상환액${method==='equalPrincipal' ? ' (첫 달)' : ''}`}
          </div>
          <div className="big num">{fmt.eok(result.firstMonth).replace('억 ', '억 ')}<span className="unit">원</span></div>
          <div className="sub">
            {deferM > 0
              ? `거치 ${deferM}개월 · 이자만 / 이후 ${payMonths}개월 분할상환`
              : `총 ${totalMonths}회 상환`}
          </div>

          <div className="calc-breakdown">
            <div className="breakdown-row">
              <span className="l">대출 원금</span>
              <span className="v num">{fmt.eok(principalWon)}원</span>
            </div>
            {deferM > 0 && (
              <>
                <div className="breakdown-row">
                  <span className="l">거치 중 월 이자</span>
                  <span className="v num">{fmt.eok(result.monthlyDefer)}원</span>
                </div>
                <div className="breakdown-row">
                  <span className="l">거치 후 월 상환액</span>
                  <span className="v num">{fmt.eok(result.monthly)}원</span>
                </div>
              </>
            )}
            <div className="breakdown-row">
              <span className="l">총 이자</span>
              <span className="v num" style={{color:'var(--accent-text)'}}>{fmt.eok(result.totalInterest)}원</span>
            </div>
            <div className="breakdown-row">
              <span className="l">총 상환액</span>
              <span className="v num">{fmt.eok(result.total)}원</span>
            </div>
            {method==='equalPrincipal' && (
              <div className="breakdown-row">
                <span className="l">마지막 달 상환액</span>
                <span className="v num">{fmt.eok(result.lastMonth)}원</span>
              </div>
            )}
            {method==='bullet' && (
              <div className="breakdown-row">
                <span className="l">만기 일시 상환액</span>
                <span className="v num">{fmt.eok(result.lastMonth)}원</span>
              </div>
            )}
          </div>
          <div style={{marginTop:14, padding:'10px 12px', background:'var(--accent-soft)', borderRadius:8, fontSize:12, color:'var(--accent-text)'}}>
            ⓘ 실제 대출 한도·금리는 은행 심사 결과에 따라 달라집니다. {type==='group' && '집단대출 변동금리는 3~6개월 주기로 변동.'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 입주 지연금 계산기 — 입주지연보상금계산.xlsx 기반
// 단계별 연이율 (사용자 확인: 12.05%가 max)
// 1~30일: 9.05% / 31~60일: 10.05% / 61~90일: 11.05% / 91일 이상: 12.05%
// 공식: ROUNDUP(원금 × 이율 / 365 × 일수, 0)
// ──────────────────────────────────────────────────────────
function DelayCalc() {
  const RATE_TIERS = [
    { maxDays: 30,  rate: 9.05,  label: '1개월 이내 (1~30일)' },
    { maxDays: 60,  rate: 10.05, label: '2개월 이내 (31~60일)' },
    { maxDays: 90,  rate: 11.05, label: '3개월 이내 (61~90일)' },
    { maxDays: Infinity, rate: 12.05, label: '3개월 초과 (91일~)' },
  ];
  const MAX_RATE = 12.05;

  const tierFor = (days) => RATE_TIERS.find(t => days <= t.maxDays) || RATE_TIERS[RATE_TIERS.length-1];

  const [base, setBase] = React.useState(29960); // 만원 (xlsx 기본값 2.996억)
  const [days, setDays] = React.useState(60);

  const baseWon = base * 10000;
  const tier = tierFor(days);
  // xlsx 공식: ROUNDUP(원금 × rate/100 / 365 × days, 0)
  const penalty = Math.ceil(baseWon * (tier.rate / 100) / 365 * days);
  const dailyPenalty = Math.ceil(baseWon * (tier.rate / 100) / 365);

  // 단계별 금액 (참고용 표)
  const tierPenalties = RATE_TIERS.map(t => {
    const checkDays = t.maxDays === Infinity ? days : t.maxDays;
    return { ...t, days: checkDays, penalty: Math.ceil(baseWon * (t.rate / 100) / 365 * checkDays) };
  });

  return (
    <div className="card card-lg">
      <div className="calc-grid">
        <div className="col gap-16">
          <div className="field">
            <label>지연금 산정 원금 <span className="dim">(기납부액 또는 잔금대출액, 만원)</span></label>
            <div className="input-suffix">
              <input type="number" value={base} onChange={e=>setBase(+e.target.value || 0)} />
              <span>만원</span>
            </div>
            <div className="slider-row">
              <input type="range" min="10000" max="80000" step="500" value={base} onChange={e=>setBase(+e.target.value)} />
              <div className="val">{fmt.eok(base*10000)}</div>
            </div>
            <div className="field-hint">분양계약서상 지체상금 산정 기준액 (기납부 분양대금)</div>
          </div>

          <div className="field">
            <label>지연 일수</label>
            <div className="input-suffix">
              <input type="number" value={days} onChange={e=>setDays(+e.target.value || 0)} />
              <span>일</span>
            </div>
            <div className="slider-row">
              <input type="range" min="0" max="365" step="1" value={days} onChange={e=>setDays(+e.target.value)} />
              <div className="val">{days}일 ({(days/30).toFixed(1)}개월)</div>
            </div>
            <div className="field-hint">
              현재 적용 이율: <strong style={{color:'var(--accent-text)'}}>{tier.rate.toFixed(2)}%</strong> ({tier.label}) · MAX {MAX_RATE}%
            </div>
          </div>

          {/* 단계별 표 */}
          <div className="field">
            <label>단계별 이율 (분양계약서 기준)</label>
            <div style={{display:'flex', flexDirection:'column', gap:6, fontSize:12.5}}>
              {RATE_TIERS.map((t, i) => {
                const active = days <= t.maxDays && (i === 0 || days > RATE_TIERS[i-1].maxDays);
                return (
                  <div key={i} className="row-between" style={{
                    padding:'6px 10px',
                    background: active ? 'var(--accent-soft)' : 'var(--surface)',
                    borderRadius:6,
                    border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
                    fontWeight: active ? 700 : 500,
                  }}>
                    <span>{t.label}</span>
                    <span className="num" style={{color: active?'var(--accent-text)':'var(--text-2)'}}>{t.rate.toFixed(2)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="calc-result">
          <div className="label">예상 지연보상금</div>
          <div className="big num" style={{color:'var(--accent-text)'}}>
            {fmt.eok(penalty)}<span className="unit">원</span>
          </div>
          <div className="sub">지연 {days}일 · 일 {fmt.comma(dailyPenalty)}원</div>

          <div className="calc-breakdown">
            <div className="breakdown-row">
              <span className="l">산정 원금</span>
              <span className="v num">{fmt.eok(baseWon)}원</span>
            </div>
            <div className="breakdown-row">
              <span className="l">적용 이율</span>
              <span className="v num">연 {tier.rate.toFixed(2)}%</span>
            </div>
            <div className="breakdown-row">
              <span className="l">계산식</span>
              <span className="v" style={{fontSize:11.5, color:'var(--text-2)'}}>원금 × 이율/365 × 일수</span>
            </div>
            <div className="breakdown-row">
              <span className="l">월 환산 (30일)</span>
              <span className="v num">약 {fmt.eok(dailyPenalty * 30)}원</span>
            </div>
            <div className="breakdown-row" style={{borderTop:'1px solid var(--border)', paddingTop:10, marginTop:4}}>
              <span className="l" style={{fontWeight:700, color:'var(--text-1)'}}>총 지연보상금</span>
              <span className="v num" style={{fontWeight:800, fontSize:15}}>{fmt.eok(penalty)}원</span>
            </div>
          </div>

          <div style={{marginTop:14, padding:'10px 12px', background:'var(--warning-soft)', borderRadius:8, fontSize:12, color:'var(--warning)'}}>
            ⓘ 본 계산은 <strong>분양계약서 지체상금 조항</strong> 기준입니다. 단계별 이율: 9.05% → 10.05% → 11.05% → <strong>12.05% (최대)</strong>. 공식: <code>ROUNDUP(원금 × 이율 / 365 × 일수, 0)</code>. 실제 보상금은 시공사 정산을 따릅니다.
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 중도금 이자 계산기 — 중도금 대출 이자 계산기(변동금리-62a기준).xlsx 기반
// 회차별 × 변동금리 5단계(A~E) × 적용일수 합산
// 공식: SUM_(회차 i) SUM_(금리 j) [회차금액_i × 일수_ij × 금리_j / 365]
// ──────────────────────────────────────────────────────────
function InterimCalc() {
  // 기본값: 62a 기준 xlsx 그대로
  const [perRound, setPerRound] = React.useState(4314); // 만원 (43,140,000원)
  const [rounds, setRounds] = React.useState(6);
  const [moveDate, setMoveDate] = React.useState('2025-12-31'); // 입주예정일(정산일)
  const [roundDates, setRoundDates] = React.useState([
    '2022-11-25', '2023-05-25', '2023-11-27', '2025-01-25', '2025-01-25', '2025-05-25',
  ]);
  const [rateTiers, setRateTiers] = React.useState([
    { rate: 6.08, start: null,         label: '기본(A)' },
    { rate: 5.54, start: '2023-05-25', label: '변동(B)' },
    { rate: 6.07, start: '2023-11-25', label: '변동(C)' },
    { rate: 5.64, start: '2024-05-25', label: '변동(D)' },
    { rate: 5.47, start: '2024-11-25', label: '변동(E)' },
  ]);

  const updateRoundDate = (i, val) => {
    const next = [...roundDates];
    next[i] = val;
    setRoundDates(next);
  };
  const updateTier = (i, field, val) => {
    const next = [...rateTiers];
    next[i] = { ...next[i], [field]: field === 'rate' ? (+val || 0) : val };
    setRateTiers(next);
  };

  const perRoundWon = perRound * 10000;
  const usedRounds = rateTiers; // A~E 그대로 사용

  // 회차별·금리구간별 이자 계산
  const calc = React.useMemo(() => {
    if (!moveDate) return { totalInterest: 0, byRound: [], byTier: [] };
    const moveD = new Date(moveDate);
    const dayMs = 1000 * 60 * 60 * 24;

    // 각 금리 구간의 [시작일, 종료일] 계산
    // A 금리: 회차 시작 ~ B 시작
    // B 금리: max(B 시작, 회차 시작) ~ C 시작
    // ...
    // E 금리: max(E 시작, 회차 시작) ~ 입주예정일
    const tierBoundaries = usedRounds.map((t, i) => {
      const start = t.start ? new Date(t.start) : null; // null = 회차 시작일을 따름
      const nextStart = i + 1 < usedRounds.length && usedRounds[i+1].start ? new Date(usedRounds[i+1].start) : moveD;
      return { ...t, startDate: start, endDate: nextStart };
    });

    const byRound = [];
    let totalInterest = 0;
    const byTierSum = usedRounds.map(t => ({ ...t, sum: 0 }));

    for (let r = 0; r < rounds; r++) {
      const roundStart = new Date(roundDates[r] || roundDates[0]);
      let roundInterest = 0;
      const tierDetails = [];
      tierBoundaries.forEach((tb, i) => {
        // 적용 시작일 = max(금리 시작일, 회차 시작일)
        const segStart = tb.startDate ? (tb.startDate > roundStart ? tb.startDate : roundStart) : roundStart;
        const segEnd = tb.endDate;
        const days = Math.max(0, Math.floor((segEnd - segStart) / dayMs));
        const interest = perRoundWon * days * (tb.rate / 100) / 365;
        roundInterest += interest;
        byTierSum[i].sum += interest;
        tierDetails.push({ tier: tb.label, days, rate: tb.rate, interest });
      });
      byRound.push({ round: r + 1, start: roundDates[r], interest: roundInterest, tiers: tierDetails });
      totalInterest += roundInterest;
    }
    return { totalInterest, byRound, byTier: byTierSum };
  }, [perRoundWon, rounds, roundDates, usedRounds, moveDate]);

  return (
    <div className="card card-lg">
      <div className="calc-grid">
        <div className="col gap-16">
          <div className="field-row">
            <div className="field">
              <label>회차당 금액 <span className="dim">(만원)</span></label>
              <div className="input-suffix">
                <input type="number" value={perRound} onChange={e=>setPerRound(+e.target.value || 0)} />
                <span>만원</span>
              </div>
              <div className="field-hint">{fmt.eok(perRoundWon)}원 × {rounds}회차 = 총 중도금 {fmt.eok(perRoundWon * rounds)}원</div>
            </div>
            <div className="field">
              <label>회차 수</label>
              <select value={rounds} onChange={e=>setRounds(+e.target.value)}
                style={{padding:'8px 12px', borderRadius:8, border:'1px solid var(--border)', background:'var(--surface)', fontSize:14, fontFamily:'inherit'}}>
                {[2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}회차</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <label>입주예정일 (정산일)</label>
            <input type="date" value={moveDate} onChange={e=>setMoveDate(e.target.value)}
              style={{padding:'8px 12px', borderRadius:8, border:'1px solid var(--border)', background:'var(--surface)', fontSize:14, fontFamily:'inherit'}} />
          </div>

          <div className="field">
            <label>회차별 시작일 (대출 실행일)</label>
            <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:8}}>
              {Array.from({length: rounds}, (_, i) => (
                <div key={i} className="row gap-6" style={{alignItems:'center'}}>
                  <span style={{fontSize:12, color:'var(--text-2)', minWidth:42, fontWeight:600}}>{i+1}회차</span>
                  <input type="date"
                    value={roundDates[i] || ''}
                    onChange={e=>updateRoundDate(i, e.target.value)}
                    style={{flex:1, padding:'6px 8px', borderRadius:6, border:'1px solid var(--border)', background:'var(--surface)', fontSize:12.5, fontFamily:'inherit'}} />
                </div>
              ))}
            </div>
          </div>

          <div className="field">
            <label>변동금리 5단계 (62a 기준)</label>
            <div style={{display:'flex', flexDirection:'column', gap:6}}>
              {rateTiers.map((t, i) => (
                <div key={i} className="row gap-6" style={{alignItems:'center'}}>
                  <span style={{fontSize:12, color:'var(--text-2)', minWidth:60, fontWeight:600}}>{t.label}</span>
                  <input type="number" step="0.01"
                    value={t.rate}
                    onChange={e=>updateTier(i, 'rate', e.target.value)}
                    style={{width:70, padding:'5px 6px', borderRadius:5, border:'1px solid var(--border)', background:'var(--surface)', fontSize:12.5, fontFamily:'inherit', textAlign:'right'}} />
                  <span style={{fontSize:11.5, color:'var(--text-2)'}}>%</span>
                  <span style={{fontSize:11, color:'var(--text-3)'}}>적용:</span>
                  <input type="date"
                    value={t.start || ''}
                    onChange={e=>updateTier(i, 'start', e.target.value || null)}
                    disabled={i===0}
                    title={i===0?'기본(A) 금리는 회차 시작일부터 적용':''}
                    style={{flex:1, padding:'5px 6px', borderRadius:5, border:'1px solid var(--border)', background: i===0?'var(--bg)':'var(--surface)', fontSize:12, fontFamily:'inherit'}} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="calc-result">
          <div className="label">중도금 이자 총합</div>
          <div className="big num" style={{color:'var(--accent-text)'}}>
            {fmt.eok(calc.totalInterest)}<span className="unit">원</span>
          </div>
          <div className="sub">{rounds}회차 × 5단계 변동금리 합산</div>

          <div className="calc-breakdown">
            <div style={{fontSize:11.5, fontWeight:700, color:'var(--text-2)', textTransform:'uppercase', letterSpacing:'.05em', marginTop:8, marginBottom:6}}>회차별 이자</div>
            {calc.byRound.map(r => (
              <div key={r.round} className="breakdown-row">
                <span className="l">{r.round}회차 ({r.start})</span>
                <span className="v num">{fmt.eok(r.interest)}원</span>
              </div>
            ))}

            <div style={{fontSize:11.5, fontWeight:700, color:'var(--text-2)', textTransform:'uppercase', letterSpacing:'.05em', marginTop:14, marginBottom:6}}>금리 단계별 이자</div>
            {calc.byTier.map((t, i) => (
              <div key={i} className="breakdown-row">
                <span className="l">{t.label} ({t.rate.toFixed(2)}%)</span>
                <span className="v num">{fmt.eok(t.sum)}원</span>
              </div>
            ))}

            <div className="breakdown-row" style={{borderTop:'1px solid var(--border)', paddingTop:10, marginTop:8}}>
              <span className="l" style={{fontWeight:700, color:'var(--text-1)'}}>총 중도금 이자</span>
              <span className="v num" style={{fontWeight:800, fontSize:15}}>{fmt.eok(calc.totalInterest)}원</span>
            </div>
          </div>

          <div style={{marginTop:14, padding:'10px 12px', background:'var(--accent-soft)', borderRadius:8, fontSize:12, color:'var(--accent-text)'}}>
            ⓘ 본 계산은 <strong>62a 변동금리 기준</strong>으로 회차별 × 단계별 적용 일수를 합산합니다. 실제 회차별 적용금리는 시공사 협약은행 변동금리에 따라 달라집니다.
          </div>
        </div>
      </div>
    </div>
  );
}

window.Calculators = Calculators;
