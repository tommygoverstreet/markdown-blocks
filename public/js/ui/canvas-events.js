/**
 * Delegated input, paste, keyboard and click handling for the block canvas.
 */
const cv = $('#cvs');
cv.addEventListener('input', e => {
    const t = e.target, b = blk(t);
    if (!b)
        return;
    const d = t.dataset;
    if (d.f)
        b[d.f] = t.value;
    else if (d.it != null)
        b.items[d.it].t = t.value;
    else if (d.d != null)
        b.items[d.d].d = t.checked ? 1 : 0;
    else if (d.r != null)
        b.rows[d.r][d.c] = t.value;
    else if (d.ak != null)
        b.a[d.ak][0] = t.value;
    else if (d.av != null)
        b.a[d.av][1] = t.value;
    if (t.tagName === 'TEXTAREA')
        grow(t);
    if (b.type === 'p' && d.f === 'text')
        magic(b, t);
    touch();
});
cv.addEventListener('focusin', e => { if (/INPUT|TEXTAREA/.test(e.target.tagName))
    lastEl = e.target; });
cv.addEventListener('paste', e => { const t = e.target, b = blk(t), s = e.clipboardData.getData('text'); if (b && b.type === 'p' && s.includes('\n') && !t.value.trim()) {
    e.preventDefault();
    const n = parse(s), i = find(b.id);
    B.splice(i, 1, ...n);
    draw();
    out();
    snap();
} });
cv.addEventListener('keydown', e => {
    const t = e.target, b = blk(t);
    if (!b)
        return;
    const i = find(b.id);
    if (b.type === 'p' && t.tagName === 'TEXTAREA') {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            add('p', i + 1);
        }
        if (e.key === 'Backspace' && !t.value && B.length > 1) {
            e.preventDefault();
            B.splice(i, 1);
            foc = B[Math.max(0, i - 1)] ? { id: B[Math.max(0, i - 1)].id } : null;
            draw();
            out();
            snap();
        }
    }
    if (t.dataset.it != null) {
        const k = +t.dataset.it, x = b.items[k];
        if (e.key === 'Enter') {
            e.preventDefault();
            b.items.splice(k + 1, 0, { t: '', d: 0, l: x.l });
            foc = { id: b.id, it: k + 1 };
            draw();
            out();
            snap();
        }
        else if (e.key === 'Backspace' && !x.t && b.items.length > 1) {
            e.preventDefault();
            b.items.splice(k, 1);
            foc = { id: b.id, it: Math.max(0, k - 1) };
            draw();
            out();
            snap();
        }
        else if (e.key === 'Tab') {
            e.preventDefault();
            x.l = Math.max(0, Math.min(2, x.l + (e.shiftKey ? -1 : 1)));
            foc = { id: b.id, it: k };
            draw();
            out();
            snap();
        }
    }
});
/* One place for every block action, so the canvas buttons and the modal
   rows run exactly the same code. */
const act = (b, a, t) => {
    const i = find(b.id);
    if (a === 'up' && i > 0)
        [B[i - 1], B[i]] = [B[i], B[i - 1]];
    else if (a === 'dn' && i < B.length - 1)
        [B[i + 1], B[i]] = [B[i], B[i + 1]];
    else if (a === 'col')
        b.c = b.c ? 0 : 1;
    else if (a[0] === 'x')
        attr(a, b, t);
    else if (a === 'dup')
        B.splice(i + 1, 0, Object.assign(JSON.parse(JSON.stringify(b)), { id: ++uid }));
    else if (a === 'del')
        B.splice(i, 1);
    else if (a === 'ar')
        b.rows.push(b.rows[0].map(() => ''));
    else if (a === 'ac')
        b.rows.forEach(r => r.push(''));
    else if (a === 'dr' && b.rows.length > 2)
        b.rows.pop();
    else if (a === 'dc' && b.rows[0].length > 1)
        b.rows.forEach(r => r.pop());
    draw();
    out();
    snap();
};
cv.addEventListener('click', e => {
    const a = e.target.dataset.a, b = blk(e.target);
    if (!a || !b)
        return;
    if (a === 'menu') {
        openBm(b);
        return;
    }
    act(b, a, e.target);
});

/* Block actions modal: the slim header holds only the grip, the label and
   a ⋮ button; every action lives here, one per row, big enough to tap.
   Native <dialog> gives backdrop tap and Escape to close for free. */
document.body.insertAdjacentHTML('beforeend', '<dialog id="bdlg"><div class="bm-head"><b id="bm-t"></b><button class="ib" id="bm-x" aria-label="Close">✕</button></div><div id="bm-acts"></div></dialog>');
const bdlg = $('#bdlg');
let bmId = null;
const openBm = b => {
    const i = find(b.id);
    if (i < 0)
        return;
    bmId = b.id;
    const fold = b.type === 'h' ? 'section' : 'block';
    $('#bm-t').textContent = T[b.type][0];
    $('#bm-acts').innerHTML = [
        ['col', (b.c ? 'Unfold ' : 'Fold ') + fold, '▸', false],
        ['up', 'Move up', '↑', i === 0],
        ['dn', 'Move down', '↓', i === B.length - 1],
        ['dup', 'Duplicate', '⧉', false],
        ['xt', 'HTML attributes' + (b.a && b.a.length ? ' ●' : ''), '⚙', false],
        ['del', 'Delete block', '✕', false]
    ].map(([a, n, ic, dis]) => `<button class="bm-act${a === 'del' ? ' bm-del' : ''}" data-bm="${a}"${dis ? ' disabled' : ''}><span>${ic}</span>${n}</button>`).join('');
    bdlg.showModal();
};
bdlg.addEventListener('click', e => {
    if (e.target === bdlg || e.target.id === 'bm-x') {
        bdlg.close();
        return;
    }
    const btn = e.target.closest('[data-bm]');
    if (!btn || !bmId)
        return;
    const b = B[find(bmId)];
    const a = btn.dataset.bm;
    bdlg.close();
    if (b)
        act(b, a, btn);
});
