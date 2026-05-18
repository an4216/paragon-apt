// Main app for 주안센트럴파라곤

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "ddayDate": "2025-12-31",
  "ddayMode": "set"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [active, setActive] = React.useState(() => {
    const hash = (window.location.hash || '').replace('#', '');
    const valid = ['home', 'complex', 'schedule', 'calc', 'downloads'];
    return valid.includes(hash) ? hash : 'home';
  });

  // Apply theme to root
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.dark ? 'dark' : 'light');
  }, [t.dark]);

  // Sync with browser back/forward
  React.useEffect(() => {
    const onHash = () => {
      const hash = (window.location.hash || '').replace('#', '');
      const valid = ['home', 'complex', 'schedule', 'calc', 'downloads'];
      if (valid.includes(hash)) setActive(hash);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Scroll to top on page change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (window.location.hash !== `#${active}`) {
      history.replaceState(null, '', `#${active}`);
    }
  }, [active]);

  const onNav = (id) => {
    setActive(id);
  };

  const effectiveDate = t.ddayMode === 'set' && t.ddayDate ? t.ddayDate : null;

  return (
    <>
      <Nav active={active} onNav={onNav} dark={t.dark} onToggleDark={()=>setTweak('dark', !t.dark)} />
      <main>
        {active === 'home' && <Hero onNav={onNav} ddayDate={effectiveDate} />}
        {active === 'complex' && <Complex />}
        {active === 'schedule' && <Schedule ddayDate={effectiveDate} />}
        {active === 'calc' && <Calculators />}
        {active === 'downloads' && <Downloads />}
      </main>
      <Footer />

      <TweaksPanel>
        <TweakSection label="테마" />
        <TweakToggle label="다크 모드" value={t.dark} onChange={v=>setTweak('dark', v)} />

        <TweakSection label="입주 예정일 (D-day)" />
        <TweakRadio
          label="상태"
          value={t.ddayMode}
          options={[
            { value: 'undecided', label: '미정' },
            { value: 'set', label: '날짜 지정' },
          ]}
          onChange={v=>setTweak('ddayMode', v)}
        />
        {t.ddayMode === 'set' && (
          <div className="twk-row">
            <div className="twk-lbl"><span>입주일</span></div>
            <input
              type="date"
              value={t.ddayDate || ''}
              onChange={e=>setTweak('ddayDate', e.target.value)}
              style={{padding:'6px 8px', borderRadius:6, border:'1px solid rgba(0,0,0,.12)', background:'rgba(255,255,255,.6)', fontSize:11.5}}
            />
          </div>
        )}
        <TweakButton label="3개월 후로 설정" onClick={()=>{
          const d = new Date();
          d.setMonth(d.getMonth() + 3);
          setTweak({ ddayMode: 'set', ddayDate: d.toISOString().slice(0,10) });
        }} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
