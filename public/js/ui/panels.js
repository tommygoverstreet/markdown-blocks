/**
 * Panel tabs, full screen mode and desktop panel toggles.
 */
// preview tabs, mobile nav
document.querySelectorAll('.tabs button[data-p]').forEach(b => b.onclick = () => { view = b.dataset.p; document.querySelectorAll('.tabs button[data-p]').forEach(x => x.classList.toggle('on', x === b)); out(); });
const go = v => document.body.dataset.v = v;
document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => go(b.dataset.go));
const FS = p => { const d = document.body; if (p) {
    d.classList.remove('hp', 'hv');
    d.dataset.fs = p;
    go({ pal: 'a', cv: 'c', pv: 'p' }[p]);
    try {
        document.documentElement.requestFullscreen().catch(() => { });
    }
    catch (e) { }
}
else {
    delete d.dataset.fs;
    try {
        document.fullscreenElement && document.exitFullscreen();
    }
    catch (e) { }
} };
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement)
    delete document.body.dataset.fs; });
document.addEventListener('click', e => { const t = e.target.closest('[data-full],[data-x]'); if (!t)
    return; if (t.dataset.full)
    FS(t.dataset.full);
else if (t.dataset.x === 'fold') {
    B.forEach(b => b.c = b.type === 'h' && b.level < 2 ? 0 : 1);
    draw();
    out();
    snap();
}
else {
    B.forEach(b => b.c = 0);
    draw();
    out();
    snap();
} });
$('#xfs').onclick = () => FS();
$('#tp').onclick = () => document.body.classList.toggle('hp');
$('#tv').onclick = () => document.body.classList.toggle('hv');
