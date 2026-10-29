/**
 * Dialog helper, import, copy and export (.md and styled .html).
 */
// dialog, templates, import, copy, export
const dlg = $('#dlg');
let dok = null;
const ask = (m, v, ok, lbl = 'OK') => { $('#dm').textContent = m; $('#dt').value = v; $('#dok').textContent = lbl; dok = ok; dlg.showModal(); };
$('#dc').onclick = () => dlg.close();
$('#dok').onclick = () => { dlg.close(); dok && dok($('#dt').value); };
$('#imp').onclick = () => ask('Paste markdown to turn it into blocks. This replaces the current page; Undo brings it back.', '', loadMd, 'Import');
const copy = s => { const t = document.createElement('textarea'); t.value = s; document.body.appendChild(t); t.select(); try {
    document.execCommand('copy');
}
catch (e) { } t.remove(); try {
    navigator.clipboard && navigator.clipboard.writeText(s);
}
catch (e) { } };
$('#cp').onclick = () => { copy(full()); $('#cp').textContent = 'Copied'; setTimeout(() => $('#cp').textContent = 'Copy', 1500); };
$('#ex').onclick = async () => {
    const s = full(), h = (B.find(b => b.type === 'h') || { text: 'document' }).text, fn = (slug(h) || 'document') + '.md';
    let ok = false;
    if (!ok) {
        try {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([s], { type: 'text/markdown' }));
            a.download = fn;
            a.click();
            ok = true;
        }
        catch (e) { }
    }
    if (!ok)
        ask('Downloads are blocked here. Copy your markdown instead.', s, () => copy(s), 'Copy');
};
const saveF = async (fn, s) => { let ok = false; if (!ok) {
    try {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([s], { type: 'text/html' }));
        a.download = fn;
        a.click();
        ok = true;
    }
    catch (e) { }
} if (!ok)
    ask('Downloads are blocked here. Copy the code instead.', s, () => copy(s), 'Copy'); };
$('#exh').onclick = () => { let css = ''; for (const sh of document.styleSheets) {
    try {
        for (const r of sh.cssRules)
            if (r.selectorText && /\.md|#out|:root/.test(r.selectorText))
                css += r.cssText;
    }
    catch (e) { }
} const h = (B.find(x => x.type === 'h') || { text: 'Document' }).text; saveF((slug(h) || 'document') + '.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(h)}</title><style>${css}html,body{margin:0}body{font:16px/1.6 system-ui,sans-serif}#out{min-height:100vh;overflow:visible;padding:28px 18px}.md{max-width:760px;margin:0 auto}${UC ? '.md{' + UC + '}' : ''}</style></head><body><div id="out" data-ot="${OT}"><div class="md">${B.map(hb).join('')}</div></div></body></html>`); };
