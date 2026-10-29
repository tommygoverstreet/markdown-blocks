/**
 * App themes and output (preview/export) themes.
 */
let OT = '';
const TH = { a: 'auto', o: '' };
try {
    Object.assign(TH, JSON.parse(localStorage.getItem('mdblocks.th')));
}
catch (e) { }
const AT = { auto: 'App theme: Auto', light: 'Light', dark: 'Dark', ocean: 'Ocean', forest: 'Forest', sunset: 'Sunset', rose: 'Rose' }, OTS = { '': 'Output: Default', paper: 'Paper', github: 'GitHub', midnight: 'Midnight', terminal: 'Terminal', pastel: 'Pastel' };
$('#th').innerHTML = Object.entries(AT).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
$('#ot').innerHTML = Object.entries(OTS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
const applyT = () => { const r = document.documentElement; TH.a === 'auto' ? r.removeAttribute('data-theme') : r.dataset.theme = TH.a; OT = TH.o; $('#th').value = TH.a; $('#ot').value = TH.o; try {
    localStorage.setItem('mdblocks.th', JSON.stringify(TH));
}
catch (e) { } };
$('#th').onchange = e => { TH.a = e.target.value; applyT(); };
$('#ot').onchange = e => { TH.o = e.target.value; applyT(); out(); };
applyT();
