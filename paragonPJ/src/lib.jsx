// Shared icons + utilities for 주안센트럴파라곤 site

const Icon = {
  Check: (p) => <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ArrowR: (p) => <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ArrowD: (p) => <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Plus: (p) => <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  Minus: (p) => <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  Close: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" {...p}><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  Search: (p) => <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" {...p}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  Download: (p) => <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" {...p}><path d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Sun: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  Moon: (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
  Calendar: (p) => <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  Pin: (p) => <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" {...p}><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2"/></svg>,
  Building: (p) => <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="3" width="16" height="18" rx="1" stroke="currentColor" strokeWidth="2"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  Doc: (p) => <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M14 3v6h6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
  Truck: (p) => <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" {...p}><path d="M1 7h12v10H1zM13 11h5l3 3v3h-8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><circle cx="5.5" cy="17.5" r="2" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="17.5" r="2" stroke="currentColor" strokeWidth="2"/></svg>,
  Won: (p) => <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" {...p}><path d="M4 6l3 9 3-9 2 9 3-9 3 9 2-9M3 11h18M3 14h18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/></svg>,
  Bell: (p) => <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/></svg>,
};

// Format numbers
const fmt = {
  won: (n) => Number(Math.round(n)).toLocaleString('ko-KR') + '원',
  manwon: (n) => Number(Math.round(n / 10000)).toLocaleString('ko-KR') + '만원',
  eok: (n) => {
    if (n >= 100000000) {
      const eok = Math.floor(n / 100000000);
      const man = Math.round((n % 100000000) / 10000);
      return man > 0 ? `${eok}억 ${man.toLocaleString('ko-KR')}만` : `${eok}억`;
    }
    return Math.round(n / 10000).toLocaleString('ko-KR') + '만';
  },
  comma: (n) => Number(n || 0).toLocaleString('ko-KR'),
  date: (d) => {
    if (!d) return '';
    const date = new Date(d);
    return `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,'0')}.${String(date.getDate()).padStart(2,'0')}`;
  },
};

// Smooth scroll to section (renamed from scrollTo to avoid clobbering window.scrollTo)
const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 56;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

Object.assign(window, { Icon, fmt, scrollToSection });
