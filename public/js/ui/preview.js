/**
 * Preview pane renderer out() and the collapsible bottom preview dock.
 */
const taskStats = () => {
    let total = 0, done = 0;
    B.forEach(b => {
        if (b.type === 'task') (b.items || []).forEach(x => { total++; if (x.d) done++; });
    });
    return { total, done };
};
const outlineHtml = () => {
    const h = heads();
    if (!h.length) return '<div class="ol-empty">Add headings to build an outline. Tap one to jump to it.</div>';
    return h.map(x => `<div class="ol-it" data-hid="${x.id}" style="margin-left:${(Math.max(1, Math.min(6, +x.level || 2)) - 1) * 14}px">${esc(x.text || 'Untitled')}</div>`).join('');
};
function out() {
    const s = full();
    $('#out').setAttribute('data-ot', view === 'r' ? OT : '');
    dock();
    $('#out').innerHTML = view === 'o' ? outlineHtml() : view === 'r' ? '<div class="md">' + (B.map(hb).join('') || '<p style="color:var(--mut)">Nothing here yet.</p>') + '</div>' : '<div id="src">' + hl(s) + '</div>';
    const w = (s.match(/[\w’'-]+/g) || []).length;
    const tk = taskStats();
    $('#st').innerHTML = `${B.length} blocks · ${w} words · ${Math.max(1, Math.round(w / 220))} min read` + (tk.total ? ` · ✓ ${tk.done}/${tk.total} tasks <span class="tpbar"><i style="width:${Math.round(tk.done / tk.total * 100)}%"></i></span>` : '');
    savePages();
}
$('#out').addEventListener('click', e => {
    const it = e.target.closest('[data-hid]');
    if (!it) return;
    const el = document.querySelector(`#cvs [data-id="${it.dataset.hid}"]`);
    if (!el) return;
    el.scrollIntoView({ block: 'center' });
    el.classList.add('hl');
    setTimeout(() => el.classList.remove('hl'), 1200);
    const f = el.querySelector('input, textarea');
    if (f) f.focus();
});
const dock = () => { const d = $('#dko'); if (d && $('#dock').classList.contains('open')) {
    d.setAttribute('data-ot', OT);
    d.innerHTML = '<div class="md">' + B.map(hb).join('') + '</div>';
} };
document.querySelector('main').insertAdjacentHTML('afterend', '<div id="dock"><div class="row"><button id="dkp">＋ Blocks</button><button id="dkb">Preview ▴</button></div><div id="dko" data-ot=""></div></div><div id="bd"></div>');
$('#dkb').onclick = () => { const d = $('#dock'); d.classList.toggle('open'); $('#dkb').textContent = d.classList.contains('open') ? 'Preview ▾' : 'Preview ▴'; dock(); };
