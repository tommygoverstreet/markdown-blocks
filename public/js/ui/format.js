/**
 * Inline formatting bar and keyboard shortcuts.
 */
// formatting
const wrap = (a, z = '') => { const t = lastEl; if (!t || t.tagName === 'SELECT')
    return; const s = t.selectionStart, e = t.selectionEnd, v = t.value, sel = v.slice(s, e) || 'text'; t.focus(); t.value = v.slice(0, s) + a + sel + (z || a) + v.slice(e); t.setSelectionRange(s + a.length, s + a.length + sel.length); t.dispatchEvent(new Event('input', { bubbles: true })); };
const FM = [['B', () => wrap('**'), 'Bold'], ['I', () => wrap('*'), 'Italic'], ['S', () => wrap('~~'), 'Strikethrough'], ['<>', () => wrap('`'), 'Inline code'], ['Link', () => wrap('[', '](https://)'), 'Link']];
$('#fmt').innerHTML = FM.map((f, i) => `<button class="btn" data-i="${i}" title="${f[2]}" style="${i == 0 ? 'font-weight:800' : i == 1 ? 'font-style:italic' : i == 2 ? 'text-decoration:line-through' : ''}">${f[0]}</button>`).join('');
$('#fmt').insertAdjacentHTML('beforeend', '<button class="btn" data-x="fold" title="Fold all sections">⊟</button><button class="btn" data-x="unf" title="Unfold all">⊞</button><button class="btn" data-full="cv" title="Full screen">⤢</button>');
$('#fmt').addEventListener('mousedown', e => e.preventDefault());
$('#fmt').addEventListener('click', e => { const i = e.target.dataset.i; if (i != null)
    FM[i][1](); });
document.addEventListener('keydown', e => {
    if (!(e.ctrlKey || e.metaKey))
        return;
    const k = e.key.toLowerCase();
    if (k === 'z' && !/INPUT|TEXTAREA/.test(e.target.tagName)) {
        e.preventDefault();
        (e.shiftKey ? $('#re') : $('#un')).click();
        return;
    }
    if (!cv.contains(e.target) || e.target.tagName === 'SELECT')
        return;
    if (k === 'b') {
        e.preventDefault();
        FM[0][1]();
    }
    if (k === 'i') {
        e.preventDefault();
        FM[1][1]();
    }
    if (k === 'k') {
        e.preventDefault();
        FM[4][1]();
    }
});
