// Nav bar
function Nav({ active, onNav, dark, onToggleDark }) {
  const items = [
    { id: 'home', label: '홈' },
    { id: 'complex', label: '단지정보' },
    { id: 'schedule', label: '입주일정' },
    { id: 'calc', label: '계산기' },
    { id: 'mover', label: '이사플래너' },
    { id: 'downloads', label: '자료실' },
  ];
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
          <button className="btn btn-ghost btn-sm" onClick={onToggleDark} title="테마">
            {dark ? <Icon.Sun /> : <Icon.Moon />}
          </button>
        </div>
      </div>
    </header>
  );
}
window.Nav = Nav;
