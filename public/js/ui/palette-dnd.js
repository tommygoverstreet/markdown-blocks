/**
 * Block palette and mouse drag and drop.
 */
// palette + drag and drop
$('#plist').innerHTML = Object.entries(T).map(([k, v]) => `<div class="pi" draggable="true" data-k="${k}" style="--c:${v[2]}" tabindex="0"><b>${v[1]}</b>${v[0]}</div>`).join('');
const pl = $('#plist');
let drag = null;
pl.addEventListener('dragstart', e => { const p = e.target.closest('.pi'); if (p) {
    drag = { n: p.dataset.k };
    e.dataTransfer.setData('text/plain', 'new');
    e.dataTransfer.effectAllowed = 'copy';
} });
pl.addEventListener('click', e => { const p = e.target.closest('.pi'); if (p) {
    add(p.dataset.k);
    if (innerWidth <= 900)
        go('c');
} });
pl.addEventListener('keydown', e => { if (e.key === 'Enter') {
    const p = e.target.closest('.pi');
    if (p)
        add(p.dataset.k);
} });
cv.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.target.classList.contains('hd'))
    e.target.closest('.bk').draggable = true; });
cv.addEventListener('dragstart', e => { const k = e.target.closest && e.target.closest('.bk'); if (k && k.draggable) {
    drag = { id: k.dataset.id };
    k.classList.add('dragging');
    e.dataTransfer.setData('text/plain', 'mv');
    e.dataTransfer.effectAllowed = 'move';
} });
cv.addEventListener('dragend', () => { drag = null; cv.querySelectorAll('.bk').forEach(k => { k.draggable = false; k.classList.remove('dragging'); }); rmDrop(); });
const rmDrop = () => document.querySelectorAll('.drop').forEach(d => d.remove());
const bi = i => { const k = cv.querySelectorAll('.bk')[i]; return k ? find(k.dataset.id) : B.length; };
const idx = y => { const ks = [...cv.querySelectorAll('.bk')]; for (let i = 0; i < ks.length; i++) {
    const r = ks[i].getBoundingClientRect();
    if (y < r.top + r.height / 2)
        return i;
} return ks.length; };
$('#cv').addEventListener('dragover', e => { if (!drag)
    return; e.preventDefault(); rmDrop(); const i = idx(e.clientY), ks = cv.querySelectorAll('.bk'), d = document.createElement('div'); d.className = 'drop'; ks[i] ? cv.insertBefore(d, ks[i]) : cv.appendChild(d); });
$('#cv').addEventListener('drop', e => {
    if (!drag)
        return;
    e.preventDefault();
    const i = bi(idx(e.clientY));
    rmDrop();
    if (drag.n)
        add(drag.n, i);
    else {
        const f = find(drag.id), [b] = B.splice(f, 1);
        B.splice(f < i ? i - 1 : i, 0, b);
        draw();
        out();
        snap();
    }
    drag = null;
});
