// Nav bar
function Nav({ active, onNav, dark, onToggleDark }) {
  const items = [
    { id: 'home', label: '홈' },
    { id: 'complex', label: '단지정보' },
    { id: 'schedule', label: '입주·이사 일정' },
    { id: 'calc', label: '계산기' },
    { id: 'downloads', label: '자료실' },
  ];
  const mobileNavRef = React.useRef(null);

  // 활성 메뉴를 모바일 가로 스크롤 영역에서 가운데로 자동 스크롤
  React.useEffect(() => {
    const container = mobileNavRef.current;
    if (!container) return;
    const activeEl = container.querySelector('a.active');
    if (!activeEl) return;
    const cRect = container.getBoundingClientRect();
    const aRect = activeEl.getBoundingClientRect();
    const target = container.scrollLeft + (aRect.left - cRect.left) - (cRect.width - aRect.width) / 2;
    container.scrollTo({ left: target, behavior: 'smooth' });
  }, [active]);

  return (
    <header className="nav">
      <div className="nav-inner">
        <a href="#home" className="nav-logo" onClick={(e)=>{e.preventDefault();onNav('home');}}>
          <span className="nav-logo-mark">JC</span>
          <span>주안센트럴파라곤<small className="hide-mobile" style={{marginLeft:8}}>입주 안내</small></span>
        </a>
        <nav className="nav-menu hide-mobile">
          {items.slice(1).map(it => (
            <a key={it.id} href={`#${it.id}`}
              className={active === it.id ? 'active' : ''}
              onClick={(e)=>{e.preventDefault(); onNav(it.id);}}>{it.label}</a>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="btn btn-ghost btn-sm" onClick={onToggleDark} title="테마" aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}>
            {dark ? <Icon.Sun /> : <Icon.Moon />}
          </button>
        </div>
      </div>
      {/* 모바일 전용 가로 스크롤 메뉴 */}
      <nav className="nav-menu-mobile" ref={mobileNavRef}>
        {items.slice(1).map(it => (
          <a key={it.id} href={`#${it.id}`}
            className={active === it.id ? 'active' : ''}
            onClick={(e)=>{e.preventDefault(); onNav(it.id);}}>{it.label}</a>
        ))}
      </nav>
    </header>
  );
}
window.Nav = Nav;
