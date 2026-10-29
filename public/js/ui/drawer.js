/**
 * Slide-out menu: blocks, templates, file actions, themes, custom CSS.
 */
const sd = document.createElement('nav');
sd.id = 'side';
sd.innerHTML = '<div class="row"><b style="flex:1;font-size:18px">Menu</b><button class="ib" id="sx" aria-label="Close menu">✕</button></div><h4>Add a block</h4><div class="pg" id="sp"></div><h4>Templates</h4><div id="stp"></div><h4>File and view</h4><div id="sf"></div><h4>App theme</h4><div id="sth"></div><h4>Custom CSS for your classes</h4><textarea id="ucss" class="mono" placeholder=".hero{color:#c2255c}"></textarea>';
document.body.appendChild(sd);
$('#sp').innerHTML = Object.entries(T).map(([k, v]) => `<div class="pi" data-k="${k}" style="--c:${v[2]}" tabindex="0"><b>${v[1]}</b>${v[0]}</div>`).join('');
$('#stp').innerHTML = Object.entries(TPLG).map(([g, l]) => `<details><summary>${g}</summary>${l.map(n => `<button class="btn" data-tp="${n}">${n}</button>`).join('')}</details>`).join('');
$('#sf').innerHTML = [['Import markdown', '#imp'], ['Copy markdown', '#cp'], ['Export .md', '#ex'], ['Export .html', '#exh'], ['Fold all sections', '[data-x=fold]'], ['Unfold all', '[data-x=unf]'], ['Show or hide block list', '#tp'], ['Show or hide preview', '#tv'], ['Full screen editor', '[data-full=cv]']].map(([n, s], i) => `<button class="btn${i == 6 || i == 7 ? ' dsk' : ''}" data-sc="${s}">${n}</button>`).join('') + '<label><input type="checkbox" id="mda"> Add attributes to .md as {#id .class}</label>';
$('#sth').appendChild($('#th'));
const sdo = o => document.body.classList.toggle('sd', o);
sd.addEventListener('click', e => { const t = e.target.closest('[data-k],[data-tp],[data-sc]'); if (!t)
    return; sdo(false); if (t.dataset.k)
    add(t.dataset.k);
else if (t.dataset.tp) {
    loadMd(TPL[t.dataset.tp]);
}
else
    document.querySelector(t.dataset.sc).click(); });
document.querySelector('header').insertAdjacentHTML('afterbegin', '<button class="btn" id="mb" aria-label="Menu">☰</button>');
$('#ex').insertAdjacentHTML('afterend', '<button class="btn" id="exh2">Export .html</button>');
$('#mb').onclick = () => sdo(true);
$('#sx').onclick = () => sdo(false);
$('#bd').onclick = () => sdo(false);
$('#dkp').onclick = () => sdo(true);
$('#exh2').onclick = () => $('#exh').click();
document.addEventListener('keydown', e => { if (e.key === 'Escape')
    sdo(false); });
$('#mda').onchange = e => { MDA = e.target.checked ? 1 : 0; out(); };
