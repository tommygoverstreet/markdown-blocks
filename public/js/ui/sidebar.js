/**
 * Pages sidebar (GitBook-style nav) and the page header above the canvas
 * (Notion-style cover, icon and title). Also the sidebar show/hide toggle.
 */
const pgList = $('#pglist'), pgq = $('#pgq');
const pcover = $('#pcover'), picon = $('#picon'), ptitle = $('#ptitle');
let pgDelArm = null;
/* ---- sidebar list ---- */
const renderPages = () => {
    const q = (pgq.value || '').trim().toLowerCase();
    const list = PAGES.filter(p => !q || (p.title || 'Untitled').toLowerCase().includes(q));
    pgList.innerHTML = list.length ? list.map(p => `<div class="pg-item${p === curPage ? ' on' : ''}" data-pg="${p.id}" tabindex="0"><span class="pg-ico">${esc(p.icon || '📄')}</span><span class="pg-t">${esc(p.title || 'Untitled')}</span><button class="ib pg-menu" data-pgm="${p.id}" title="Page actions" aria-label="Page actions">⋮</button></div>`).join('') : '<div class="pg-empty">No pages match.</div>';
};
pgq.addEventListener('input', renderPages);
pgList.addEventListener('click', e => {
    const m = e.target.closest('[data-pgm]');
    if (m) {
        e.stopPropagation();
        openPgMenu(m.dataset.pgm, m);
        return;
    }
    const it = e.target.closest('[data-pg]');
    if (it) {
        switchPage(it.dataset.pg);
        if (innerWidth <= 900) document.body.classList.remove('pg');
    }
});
pgList.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const it = e.target.closest('[data-pg]');
    if (it) {
        switchPage(it.dataset.pg);
        if (innerWidth <= 900) document.body.classList.remove('pg');
    }
});
/* ---- page actions popover ---- */
const pgpop = document.createElement('div');
pgpop.id = 'pgpop';
pgpop.hidden = true;
document.body.appendChild(pgpop);
let pgpopFor = null;
const closePgMenu = () => { pgpop.hidden = true; pgpopFor = null; pgDelArm = null; };
const openPgMenu = (id, anchor) => {
    const p = PAGES.find(x => x.id === id);
    if (!p) return;
    pgpopFor = id;
    pgDelArm = null;
    pgpop.innerHTML = `<button class="pp-act" data-pp="rename">✎ Rename</button><button class="pp-act" data-pp="dup">⧉ Duplicate</button><button class="pp-act pp-del" data-pp="del">✕ Delete page</button>`;
    pgpop.hidden = false;
    const r = anchor.getBoundingClientRect();
    pgpop.style.top = Math.min(innerHeight - 140, r.bottom + 4) + 'px';
    pgpop.style.left = Math.max(8, Math.min(innerWidth - 190, r.left - 140)) + 'px';
};
pgpop.addEventListener('click', e => {
    const b = e.target.closest('[data-pp]');
    if (!b || !pgpopFor) return;
    const p = PAGES.find(x => x.id === pgpopFor);
    if (!p) {
        closePgMenu();
        return;
    }
    if (b.dataset.pp === 'rename') {
        closePgMenu();
        ask('Rename page', p.title || '', v => {
            const t = (v || '').trim();
            p.title = t || 'Untitled';
            savePages();
            renderPages();
            renderPageHead();
        }, 'Rename');
    }
    else if (b.dataset.pp === 'dup') {
        const copy = duplicatePage(p.id);
        closePgMenu();
        if (copy) {
            switchPage(copy.id);
            toast('Page duplicated.');
        }
    }
    else if (b.dataset.pp === 'del') {
        if (PAGES.length <= 1) {
            closePgMenu();
            toast('Keep at least one page.');
            return;
        }
        if (pgDelArm !== p.id) {
            pgDelArm = p.id;
            b.textContent = 'Tap again to delete';
            return;
        }
        closePgMenu();
        if (deletePage(p.id)) toast('Page deleted.');
    }
});
document.addEventListener('click', e => {
    if (!pgpop.hidden && !pgpop.contains(e.target) && !e.target.closest('[data-pgm]')) closePgMenu();
    if (!ppick.hidden && !ppick.contains(e.target) && e.target !== pcover && e.target !== picon) ppick.hidden = true;
});
/* ---- new page / export book ---- */
const newPageGo = () => {
    const p = addPage('Untitled', [nb('p')]);
    savePages();
    switchPage(p.id);
    const first = p.blocks[0];
    foc = { id: first.id };
    draw();
    if (innerWidth <= 900) document.body.classList.remove('pg');
    setTimeout(() => ptitle.focus(), 0);
};
$('#pgnew').onclick = newPageGo;
$('#pgbook').onclick = () => exportBook();
/* ---- page header: cover, icon, title ---- */
const ppick = document.createElement('div');
ppick.id = 'ppick';
ppick.hidden = true;
document.body.appendChild(ppick);
let ppickKind = null;
const openPick = (kind, anchor) => {
    ppickKind = kind;
    if (kind === 'icon') {
        ppick.innerHTML = '<div class="pp-grid">' + ICONS.map(ic => `<button class="pp-ic" data-v="${ic}">${ic}</button>`).join('') + '</div>';
    }
    else {
        ppick.innerHTML = '<div class="pp-grid">' + COVERS.map((c, i) => `<button class="pp-cv" data-v="${i}" style="background:${c || 'var(--soft)'}" title="${c ? 'Cover ' + i : 'No cover'}">${c ? '' : '✕'}</button>`).join('') + '</div>';
    }
    ppick.hidden = false;
    const r = anchor.getBoundingClientRect();
    ppick.style.top = (r.bottom + 6) + 'px';
    ppick.style.left = Math.max(8, Math.min(innerWidth - 220, r.left)) + 'px';
};
ppick.addEventListener('click', e => {
    const b = e.target.closest('[data-v]');
    if (!b || !curPage) return;
    if (ppickKind === 'icon') curPage.icon = b.dataset.v;
    else curPage.cover = +b.dataset.v;
    ppick.hidden = true;
    savePages();
    renderPageHead();
    renderPages();
});
const renderPageHead = () => {
    if (!curPage) return;
    if (curPage.cover) {
        pcover.style.background = COVERS[curPage.cover];
        pcover.textContent = '';
        pcover.classList.remove('none');
    }
    else {
        pcover.style.background = '';
        pcover.textContent = '+ Add cover';
        pcover.classList.add('none');
    }
    picon.textContent = curPage.icon || '📄';
    if (document.activeElement !== ptitle) ptitle.value = curPage.title || '';
    document.title = (curPage.title || 'Markdown Blocks') + ' · Markdown Blocks';
};
pcover.onclick = () => openPick('cover', pcover);
picon.onclick = () => openPick('icon', picon);
ptitle.addEventListener('input', () => {
    if (!curPage) return;
    curPage.title = ptitle.value;
    savePages();
    renderPages();
});
/* ---- sidebar show / hide ---- */
$('#pgb').onclick = () => {
    if (innerWidth <= 900) document.body.classList.toggle('pg');
    else document.body.classList.toggle('hpg');
};
$('#bd').addEventListener('click', () => document.body.classList.remove('pg'));
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.body.classList.remove('pg');
        closePgMenu();
        ppick.hidden = true;
    }
});
