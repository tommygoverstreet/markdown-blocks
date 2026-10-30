/**
 * Block editor views (body), canvas renderer (draw), add() and paragraph auto-conversion (magic).
 */
const grow = t => { t.style.height = 'auto'; t.style.height = t.scrollHeight + 4 + 'px'; };
const hid = () => { const h = new Set; let l = 0; B.forEach(b => { if (l) {
    if (b.type === 'h' && b.level <= l)
        l = 0;
    else {
        h.add(b.id);
        return;
    }
} if (b.type === 'h' && b.c)
    l = +b.level; }); return h; };
const hc = b => { let n = 0, i = find(b.id) + 1; for (; i < B.length && !(B[i].type === 'h' && B[i].level <= b.level); i++)
    n++; return n; };
const peek = b => b.text || b.url || (b.type === 'table' ? b.rows[0].join(' | ') : b.items ? b.items.map(x => x.t).filter(Boolean).join(', ') : '') || '';
const ta = (b, f, ph, cls = '') => `<textarea rows="1" class="${cls}" data-f="${f}" placeholder="${ph}">${esc(b[f])}</textarea>`;
function body(b) {
    switch (b.type) {
        case 'h': return `<div class="row"><select data-f="level">${[1, 2, 3, 4, 5, 6].map(n => `<option value="${n}"${b.level == n ? ' selected' : ''}>H${n}</option>`).join('')}</select><input class="big" data-f="text" value="${at(b.text)}" placeholder="Heading"></div>`;
        case 'p': return ta(b, 'text', 'Write something, or start with # , - , 1. , &gt; or ``` to convert');
        case 'quote': return ta(b, 'text', 'Quote');
        case 'code': return `<input class="mono" data-f="lang" value="${at(b.lang)}" placeholder="language (js, python, bash…)" style="margin-bottom:4px">` + ta(b, 'text', 'Code', 'mono');
        case 'ul':
        case 'ol':
        case 'task': return b.items.map((x, i) => `<div class="it" style="margin-left:${x.l * 22}px">${b.type === 'task' ? `<input type="checkbox" data-d="${i}"${x.d ? ' checked' : ''}>` : `<span class="n">${b.type === 'ol' ? lines(b)[i].p : '•'}</span>`}<input data-it="${i}" value="${at(x.t)}" placeholder="List item"></div>`).join('');
        case 'table': return `<div class="tb"><table>${b.rows.map((r, i) => '<tr>' + r.map((c, j) => `<td><input data-r="${i}" data-c="${j}" value="${at(c)}"></td>`).join('') + '</tr>').join('')}</table></div><div class="row" style="margin-top:6px"><button class="btn" data-a="ar">+ Row</button><button class="btn" data-a="ac">+ Column</button><button class="btn" data-a="dr">– Row</button><button class="btn" data-a="dc">– Column</button></div>`;
        case 'img': return `<input data-f="url" value="${at(b.url)}" placeholder="Image URL"><input data-f="alt" value="${at(b.alt)}" placeholder="Describe the image">`;
        case 'link': return `<input data-f="text" value="${at(b.text)}" placeholder="Link text"><input data-f="url" value="${at(b.url)}" placeholder="https://…">`;
        case 'note': return `<select data-f="kind" style="margin-bottom:4px">${Object.keys(KC).map(k => `<option${b.kind === k ? ' selected' : ''}>${k}</option>`).join('')}</select>` + ta(b, 'text', 'Callout text');
        case 'det': return `<input data-f="sum" value="${at(b.sum)}" placeholder="Summary" style="font-weight:600">` + ta(b, 'text', 'Hidden content');
        case 'hr': return '<div style="height:2px;background:var(--ln);margin:10px 0"></div>';
        case 'toc': return '<div style="color:var(--mut)">Builds itself from your headings.</div>';
    }
}
function draw() {
    const c = $('#cvs');
    const H = hid();
    c.innerHTML = B.length ? B.filter(b => !H.has(b.id)).map(b => `<div class="bk" data-id="${b.id}" style="--c:${T[b.type][2]}"><div class="bh"><span class="hd" title="Drag to reorder">⠿</span><span>${T[b.type][0]}${b.c && b.type === 'h' ? ' · ' + hc(b) + ' folded' : ''}</span><button class="ib" data-a="menu" title="Block actions" aria-label="Block actions">⋮</button></div>${b.ao ? apanel(b) : ''}${b.c && b.type !== 'h' ? '<div class="pk">' + esc(peek(b)) + '</div>' : body(b)}</div>`).join('') : '<div class="empty"><p>Your page is empty.</p><div class="row" style="justify-content:center;flex-wrap:wrap"><button class="btn pri" data-tp="Welcome">Start with a guide</button><button class="btn" data-tp="README">README</button><button class="btn" data-k="p">Add a paragraph</button></div></div>';
    c.querySelectorAll('textarea').forEach(grow);
    if (foc) {
        const e = c.querySelector(`[data-id="${foc.id}"]`), f = e && (foc.it != null ? e.querySelector(`[data-it="${foc.it}"]`) : e.querySelector('textarea,input:not([type=checkbox])'));
        if (f) {
            f.focus();
            try {
                f.setSelectionRange(f.value.length, f.value.length);
            }
            catch (x) { }
        }
        foc = null;
    }
}
const find = id => B.findIndex(b => b.id == id), blk = t => { const e = t.closest('.bk'); return e && B[find(e.dataset.id)]; };
function add(type, at, o) { const b = nb(type, o); if (type === 'hr' || type === 'toc')
    b.text = ''; B.splice(at == null ? B.length : at, 0, b); foc = type === 'hr' ? null : { id: b.id }; draw(); out(); snap(); return b; }
function magic(b, t) {
    const v = t.value;
    let m, n = null;
    if (m = v.match(/^(#{1,6}) (.*)/s))
        n = ['h', { level: m[1].length, text: m[2] }];
    else if (m = v.match(/^[-*] (.*)/s))
        n = ['ul', { items: [{ t: m[1], d: 0, l: 0 }] }];
    else if (m = v.match(/^1\. (.*)/s))
        n = ['ol', { items: [{ t: m[1], d: 0, l: 0 }] }];
    else if (m = v.match(/^\[ ?\] (.*)/s))
        n = ['task', { items: [{ t: m[1], d: 0, l: 0 }] }];
    else if (m = v.match(/^> (.*)/s))
        n = ['quote', { text: m[1] }];
    else if (/^```/.test(v))
        n = ['code', {}];
    else if (v === '---')
        n = ['hr', {}];
    if (n) {
        const i = find(b.id), x = nb(n[0], n[1]);
        B[i] = x;
        foc = { id: x.id, it: n[0].match(/ul|ol|task/) ? 0 : null };
        draw();
        out();
        snap();
    }
}
