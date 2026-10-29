/**
 * User-defined CSS applied to the preview and HTML export.
 */
const ucs = document.createElement('style');
document.head.appendChild(ucs);
const setUC = v => { UC = v; ucs.textContent = v ? `#out .md,#dko .md{${v}}` : ''; try {
    localStorage.setItem('mdblocks.css', v);
}
catch (e) { } };
$('#ucss').oninput = e => { setUC(e.target.value); out(); };
try {
    UC = localStorage.getItem('mdblocks.css') || '';
}
catch (e) { }
$('#ucss').value = UC;
setUC(UC);
