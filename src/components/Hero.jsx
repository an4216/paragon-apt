// Hero - 제발 입주 좀 하자
function Hero({ onNav, ddayDate }) {
  // Compute D-day
  const dday = React.useMemo(() => {
    if (!ddayDate) return null;
    const now = new Date();
    now.setHours(0,0,0,0);
    const target = new Date(ddayDate);
    target.setHours(0,0,0,0);
    const diff = Math.floor((target - now) / (1000*60*60*24));
    return { diff, target };
  }, [ddayDate]);

  return (
    <section id="home" className="section hero">
      <div className="wrap">
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow">
              <span className="dot">!</span>
              <span>입주 최초예정 2025.12.31 · 지연 중 · 시공사 공지 대기</span>
            </div>
            <h1>
              제발<br/>
              <span className="accent">입주</span> 좀<br/>
              <span className="stroked">하자.</span>
            </h1>
            <p className="hero-sub">
              주안센트럴파라곤 입주 예정자를 위한 통합 안내 페이지.<br/>
              일정 · 잔금 · 대출 · 이사 · 자료까지 한 곳에서.
            </p>
            <div className="hero-meta">
              <div className="hero-meta-item">
                <div className="label">위치</div>
                <div className="value">인천시 미추홀구 주안동 590-22번지</div>
              </div>
              <div className="hero-meta-item">
                <div className="label">규모</div>
                <div className="value">12개동 · 총 1,321세대</div>
              </div>
              <div className="hero-meta-item">
                <div className="label">시공사</div>
                <div className="value">라인건설 (주안 센트럴 파라곤)</div>
              </div>
            </div>
            <div className="hero-cta-row">
              <button className="btn btn-primary btn-lg" onClick={()=>onNav('schedule')}>
                입주 일정 보기 <Icon.ArrowR />
              </button>
              <button className="btn btn-lg" onClick={()=>onNav('calc')}>
                대출·지연금 계산기
              </button>
              <button className="btn btn-ghost btn-lg" onClick={()=>onNav('downloads')}>
                자료실
              </button>
            </div>
          </div>

          <DdayCard dday={dday} ddayDate={ddayDate} />
        </div>

        <div className="marquee">
          <div className="marquee-track">
            <span>입주 예정일 확정 시 즉시 공지됩니다</span>
            <span>사전점검은 입주 30일 전부터 진행됩니다</span>
            <span>입주지연 시 지체상금 청구 가능</span>
            <span>중도금·잔금 대출 사전 상담 권장</span>
            <span>입주 예정일 확정 시 즉시 공지됩니다</span>
            <span>사전점검은 입주 30일 전부터 진행됩니다</span>
            <span>입주지연 시 지체상금 청구 가능</span>
            <span>중도금·잔금 대출 사전 상담 권장</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function DdayCard({ dday, ddayDate }) {
  return (
    <div className="dday-card">
      <div className="pulse">
        <span className="dot"></span>
        <span>LIVE</span>
      </div>
      <div className="label">{dday && dday.diff < 0 ? '최초예정일 경과' : '입주 예정일까지'}</div>
      {dday ? (
        <>
          <div className="big num">
            {dday.diff > 0 ? `D-${dday.diff}` : dday.diff === 0 ? 'D-DAY' : `D+${-dday.diff}`}
          </div>
          <div className="sub">{fmt.date(dday.target)} 기준 · 시공사 공식 일정 아님</div>
          <div className="dday-stats">
            <div className="dday-stat">
              <div className="l">최초 예정</div>
              <div className="v num">2025.12.31</div>
            </div>
            <div className="dday-stat">
              <div className="l">잔금일</div>
              <div className="v num">{dday.diff > 0 ? `${Math.max(0, dday.diff - 7)}일` : '경과'}</div>
            </div>
            <div className="dday-stat">
              <div className="l">사전점검</div>
              <div className="v num">{dday.diff > 0 ? `${Math.max(0, dday.diff - 30)}일` : '경과'}</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="undecided">미정</div>
          <div className="sub">시공사 측에서 입주 예정일을 아직 공지하지 않았습니다.</div>
          <div className="dday-stats">
            <div className="dday-stat">
              <div className="l">최초 예정</div>
              <div className="v num">2025.12.31</div>
            </div>
            <div className="dday-stat">
              <div className="l">현재</div>
              <div className="v num">지연 중</div>
            </div>
            <div className="dday-stat">
              <div className="l">공지</div>
              <div className="v num">대기</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
window.Hero = Hero;
