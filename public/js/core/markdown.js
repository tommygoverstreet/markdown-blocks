const safe = u => {
    const value = String(u ?? '').trim();
    if (!value) return '#';
    const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, '');
    return /^(?:javascript|vbscript|data)\s*:/i.test(cleaned) ? '#' : cleaned;
};
const normalizeSafeUrl = (u = '') => safe(u);
const inl = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, a, u) => `<img alt="${a}" src="${normalizeSafeUrl(u)}">`).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${normalizeSafeUrl(u)}" target="_blank" rel="noopener">${esc(t)}</a>`).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
