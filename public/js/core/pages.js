/**
 * Pages: a multi-document store (GitBook-style). A page is
 * { id, title, icon, cover, blocks }. The live block array B always points
 * at the current page's blocks; savePages() syncs it back before writing.
 * First run migrates the old single-document key (mdblocks.v1) into page 1.
 */
const PGK = 'mdblocks.pages.v1', CURK = 'mdblocks.cur.v1';
const ICONS = ['📄', '📝', '📋', '💡', '📚', '🚀', '💼', '📊', '🎯', '✈️', '🏠', '⭐'];
const COVERS = ['', 'linear-gradient(135deg,#e9d5ff,#fbcfe8)', 'linear-gradient(135deg,#d1fae5,#dbeafe)', 'linear-gradient(135deg,#fde68a,#fbcfe8)', 'linear-gradient(135deg,#a5f3fc,#c4b5fd)', 'linear-gradient(135deg,#fecaca,#fed7aa)', 'linear-gradient(135deg,#c7d2fe,#fbcfe8)'];
let PAGES = [], curPage = null;
const pid = () => 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
const newPage = (title, blocks) => ({ id: pid(), title: title || 'Untitled', icon: '📄', cover: 1, blocks: blocks || [] });
const maxUid = () => { let m = 0; PAGES.forEach(p => (p.blocks || []).forEach(b => { m = Math.max(m, Number(b.id) || 0); })); return m; };
const savePages = () => {
    if (curPage) curPage.blocks = B;
    try {
        localStorage.setItem(PGK, JSON.stringify(PAGES));
        localStorage.setItem(CURK, curPage ? curPage.id : '');
        localStorage.setItem('mdblocks.v1', JSON.stringify(B));
    }
    catch (e) { }
};
const loadPages = () => {
    try {
        const parsed = JSON.parse(localStorage.getItem(PGK) || 'null');
        if (Array.isArray(parsed) && parsed.length) {
            PAGES = parsed.filter(p => p && typeof p === 'object' && Array.isArray(p.blocks)).map(p => ({ id: p.id || pid(), title: p.title || 'Untitled', icon: p.icon || '📄', cover: typeof p.cover === 'number' ? p.cover : 1, blocks: p.blocks.filter(b => b && typeof b === 'object' && typeof b.type === 'string') }));
        }
    }
    catch (e) { }
    if (!PAGES.length) {
        let old = [];
        try {
            const o = JSON.parse(localStorage.getItem('mdblocks.v1') || 'null');
            if (Array.isArray(o)) old = o.filter(b => b && typeof b === 'object' && typeof b.type === 'string');
        }
        catch (e) { }
        if (old.length) {
            const t = (old.find(b => b.type === 'h') || {}).text || 'My first page';
            PAGES.push(newPage(t, old));
        }
    }
    uid = maxUid();
};
const switchPage = id => {
    const p = PAGES.find(x => x.id === id);
    if (!p || p === curPage) return false;
    if (curPage) curPage.blocks = B;
    curPage = p;
    B = p.blocks;
    uid = Math.max(uid, maxUid());
    U = [];
    R = [];
    renderPages();
    renderPageHead();
    draw();
    out();
    snap();
    return true;
};
const addPage = (title, blocks) => {
    const p = newPage(title, blocks);
    PAGES.push(p);
    return p;
};
const duplicatePage = id => {
    const p = PAGES.find(x => x.id === id);
    if (!p) return null;
    const blocks = JSON.parse(JSON.stringify(p.blocks || []));
    blocks.forEach(b => { b.id = ++uid; });
    const copy = { id: pid(), title: (p.title || 'Untitled') + ' copy', icon: p.icon, cover: p.cover, blocks };
    PAGES.splice(PAGES.indexOf(p) + 1, 0, copy);
    savePages();
    return copy;
};
const deletePage = id => {
    if (PAGES.length <= 1) {
        toast('Keep at least one page.');
        return false;
    }
    const i = PAGES.findIndex(x => x.id === id);
    if (i < 0) return false;
    if (PAGES[i] === curPage) switchPage(PAGES[i + 1] ? PAGES[i + 1].id : PAGES[i - 1].id);
    PAGES.splice(PAGES.indexOf(PAGES.find(x => x.id === id)), 1);
    savePages();
    renderPages();
    return true;
};
