/**
 * Slash menu (type / at the start of a paragraph to insert a block) and the
 * command palette (Ctrl/⌘K: search pages and blocks, run actions).
 */
/* ---- slash menu ---- */
const slashEl = document.createElement('div');
slashEl.id = 'slash';
slashEl.hidden = true;
document.body.appendChild(slashEl);
let slash = null;
const slashList = q => Object.entries(T).filter(([k, v]) => !q || v[0].toLowerCase().includes(q) || k.includes(q));
const slashRender = () => {
    if (!slash) return;
    const items = slashList(slash.q);
    if (!items.length) {
        slashEl.hidden = true;
        return;
    }
    slash.sel = Math.min(slash.sel, items.length - 1);
    slashEl.innerHTML = items.map(([k, v], i) => `<div class="sl-it${i === slash.sel ? ' on' : ''}" data-sl="${k}"><b style="color:${v[2]}">${v[1]}</b><span>${v[0]}</span></div>`).join('');
    slashEl.hidden = false;
    const r = slash.el.getBoundingClientRect();
    slashEl.style.left = Math.max(8, Math.min(innerWidth - 230, r.left)) + 'px';
    slashEl.style.top = (r.bottom + 4) + 'px';
};
const slashClose = () => { slash = null; slashEl.hidden = true; };
const slashCheck = (b, el) => {
    if (!b || b.type !== 'p' || el.tagName !== 'TEXTAREA') {
        slashClose();
        return false;
    }
    const v = el.value;
    if (!v.startsWith('/')) {
        slashClose();
        return false;
    }
    if (!slash || slash.b !== b) slash = { b, el, q: '', sel: 0 };
    slash.el = el;
    slash.q = v.slice(1).split(/\s/)[0].toLowerCase();
    slashRender();
    return true;
};
const slashPick = k => {
    if (!slash) return;
    const b = slash.b, i = find(b.id);
    if (i < 0) {
        slashClose();
        return;
    }
    const n = nb(k);
    B[i] = n;
    foc = { id: n.id, it: /^(ul|ol|task)$/.test(k) ? 0 : null };
    slashClose();
    draw();
    out();
    snap();
};
const slashKey = e => {
    if (!slash) return false;
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        slash.sel = Math.min(slashList(slash.q).length - 1, slash.sel + 1);
        slashRender();
        return true;
    }
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        slash.sel = Math.max(0, slash.sel - 1);
        slashRender();
        return true;
    }
    if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const items = slashList(slash.q);
        if (items[slash.sel]) slashPick(items[slash.sel][0]);
        return true;
    }
    if (e.key === 'Escape') {
        e.preventDefault();
        slashClose();
        return true;
    }
    return false;
};
slashEl.addEventListener('mousedown', e => {
    e.preventDefault();
    const it = e.target.closest('[data-sl]');
    if (it) slashPick(it.dataset.sl);
});
/* ---- command palette ---- */
const cmdkEl = document.createElement('div');
cmdkEl.id = 'cmdk';
cmdkEl.hidden = true;
cmdkEl.innerHTML = '<div class="ck-box"><input id="ckq" placeholder="Search pages, blocks, actions…" autocomplete="off"><div id="ckr"></div><div class="ck-hint">↑↓ to move · Enter to open · Esc to close</div></div>';
document.body.appendChild(cmdkEl);
const ckq = cmdkEl.querySelector('#ckq'), ckr = cmdkEl.querySelector('#ckr');
let cmdkSel = 0, cmdkResults = [];
const cmdkFor = q => {
    const res = [], lq = (q || '').trim().toLowerCase();
    PAGES.forEach(p => {
        if (!lq || (p.title || '').toLowerCase().includes(lq)) res.push({ kind: 'page', p, label: p.title || 'Untitled', sub: (p.blocks || []).length + ' blocks' });
        (p.blocks || []).forEach(b => {
            const t = peek(b);
            if (lq && t && t.toLowerCase().includes(lq)) res.push({ kind: 'block', p, b, label: t.slice(0, 80), sub: 'in ' + (p.title || 'Untitled') });
        });
    });
    if (!lq || 'new page'.includes(lq)) res.push({ kind: 'act', act: 'new', label: 'New page', sub: 'Create a blank page' });
    if (!lq || 'export book'.includes(lq)) res.push({ kind: 'act', act: 'book', label: 'Export book (.md)', sub: 'All pages in one file' });
    if (!lq || 'export'.includes(lq)) res.push({ kind: 'act', act: 'md', label: 'Export .md', sub: 'Current page as markdown' });
    return res.slice(0, 12);
};
const cmdkRender = () => {
    cmdkResults = cmdkFor(ckq.value);
    cmdkSel = Math.min(cmdkSel, Math.max(0, cmdkResults.length - 1));
    ckr.innerHTML = cmdkResults.length ? cmdkResults.map((r, i) => `<div class="ck-it${i === cmdkSel ? ' on' : ''}" data-ck="${i}"><span class="ck-k">${r.kind === 'page' ? '📄' : r.kind === 'block' ? '¶' : '⚡'}</span><span class="ck-l">${esc(r.label)}</span><span class="ck-s">${esc(r.sub || '')}</span></div>`).join('') : '<div class="ck-none">No matches.</div>';
};
const cmdkOpenFn = () => {
    cmdkEl.hidden = false;
    ckq.value = '';
    cmdkSel = 0;
    cmdkRender();
    setTimeout(() => ckq.focus(), 0);
};
const cmdkClose = () => { cmdkEl.hidden = true; };
const cmdkGo = r => {
    if (!r) return;
    cmdkClose();
    if (r.kind === 'act') {
        if (r.act === 'new') newPageGo();
        else if (r.act === 'book') exportBook();
        else if (r.act === 'md') $('#ex').click();
        return;
    }
    if (r.p !== curPage) switchPage(r.p.id);
    if (r.kind === 'block') {
        foc = { id: r.b.id };
        draw();
        const el = document.querySelector(`#cvs [data-id="${r.b.id}"]`);
        if (el) {
            el.scrollIntoView({ block: 'center' });
            el.classList.add('hl');
            setTimeout(() => el.classList.remove('hl'), 1200);
        }
    }
};
ckq.addEventListener('input', () => { cmdkSel = 0; cmdkRender(); });
ckq.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        cmdkSel = Math.min(cmdkResults.length - 1, cmdkSel + 1);
        cmdkRender();
    }
    else if (e.key === 'ArrowUp') {
        e.preventDefault();
        cmdkSel = Math.max(0, cmdkSel - 1);
        cmdkRender();
    }
    else if (e.key === 'Enter') {
        e.preventDefault();
        cmdkGo(cmdkResults[cmdkSel]);
    }
    else if (e.key === 'Escape') {
        e.preventDefault();
        cmdkClose();
    }
});
ckr.addEventListener('click', e => {
    const it = e.target.closest('[data-ck]');
    if (it) cmdkGo(cmdkResults[+it.dataset.ck]);
});
cmdkEl.addEventListener('click', e => { if (e.target === cmdkEl) cmdkClose(); });
$('#ckb').onclick = cmdkOpenFn;
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && !cv.contains(e.target)) {
        e.preventDefault();
        cmdkOpenFn();
    }
});
