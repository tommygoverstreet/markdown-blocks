/**
 * Preview pane renderer out() and the collapsible bottom preview dock.
 */
function out() {
    const s = full();
    $('#out').setAttribute('data-ot', view === 'r' ? OT : '');
    dock();
    $('#out').innerHTML = view === 'r' ? '<div class="md">' + (B.map(hb).join('') || '<p style="color:var(--mut)">Nothing here yet.</p>') + '</div>' : '<div id="src">' + hl(s) + '</div>';
    const w = (s.match(/[\w’'-]+/g) || []).length;
    $('#st').textContent = `${B.length} blocks · ${w} words · ${Math.max(1, Math.round(w / 220))} min read`;
    try {
        localStorage.setItem('mdblocks.v1', JSON.stringify(B));
    }
    catch (e) { }
}
const dock = () => { const d = $('#dko'); if (d && $('#dock').classList.contains('open')) {
    d.setAttribute('data-ot', OT);
    d.innerHTML = '<div class="md">' + B.map(hb).join('') + '</div>';
} };
document.querySelector('main').insertAdjacentHTML('afterend', '<div id="dock"><div class="row"><button id="dkp">＋ Blocks</button><button id="dkb">Preview ▴</button></div><div id="dko" data-ot=""></div></div><div id="bd"></div>');
$('#dkb').onclick = () => { const d = $('#dock'); d.classList.toggle('open'); $('#dkb').textContent = d.classList.contains('open') ? 'Preview ▾' : 'Preview ▴'; dock(); };
