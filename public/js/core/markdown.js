/**
 * Markdown parser, block serializers (md), HTML renderer (html) and attribute helpers.
 */
function parse(s) {
    const L = s.replace(/\r/g, '').split('\n'), o = [];
    let i = 0, m;
    const st = l => /^(```|#{1,6}\s|>|\s*([-*+]|\d+\.)\s|---\s*$|\|)/.test(l);
    while (i < L.length) {
        const l = L[i];
        if (!l.trim()) {
            i++;
            continue;
        }
        if (m = l.match(/^```(\S*)/)) {
            const c = [];
            i++;
            while (i < L.length && !/^```/.test(L[i]))
                c.push(L[i++]);
            i++;
            o.push(nb('code', { lang: m[1], text: c.join('\n') }));
            continue;
        }
        if (m = l.match(/^(#{1,6})\s+(.*)/)) {
            o.push(nb('h', { level: m[1].length, text: m[2] }));
            i++;
            continue;
        }
        if (/^(---|\*\*\*|___)\s*$/.test(l)) {
            o.push(nb('hr'));
            i++;
            continue;
        }
        if (/^>/.test(l)) {
            const c = [];
            while (i < L.length && /^>/.test(L[i]))
                c.push(L[i++].replace(/^>\s?/, ''));
            const a = c[0].match(/^\[!(\w+)\]\s*$/);
            a ? o.push(nb('note', { kind: a[1].toUpperCase(), text: c.slice(1).join('\n') })) : o.push(nb('quote', { text: c.join('\n') }));
            continue;
        }
        if (/^\s*([-*+]|\d+\.)\s/.test(l)) {
            const it = [], ord = /^\s*\d/.test(l);
            let task = false;
            while (i < L.length && (m = L[i].match(/^(\s*)([-*+]|\d+\.)\s+(.*)/))) {
                let t = m[3], d = 0, k = t.match(/^\[([ xX])\]\s?(.*)/);
                if (k) {
                    task = true;
                    d = k[1] !== ' ';
                    t = k[2];
                }
                it.push({ t, d: +d, l: Math.min(2, Math.floor(m[1].length / 2)) });
                i++;
            }
            o.push(nb(task ? 'task' : ord ? 'ol' : 'ul', { items: it }));
            continue;
        }
        if (/^\|/.test(l) && /^\|?[\s:|-]+\|/.test(L[i + 1] || '')) {
            const r = [];
            while (i < L.length && /^\|/.test(L[i])) {
                if (!/^\|[\s:|-]+\|?\s*$/.test(L[i]))
                    r.push(L[i].replace(/^\||\|\s*$/g, '').split('|').map(x => x.trim()));
                i++;
            }
            o.push(nb('table', { rows: r }));
            continue;
        }
        if (m = l.match(/^!\[([^\]]*)\]\(([^)]*)\)\s*$/)) {
            o.push(nb('img', { alt: m[1], url: m[2] }));
            i++;
            continue;
        }
        if (m = l.match(/^\[([^\]]+)\]\(([^)]+)\)\s*$/)) {
            o.push(nb('link', { text: m[1], url: m[2] }));
            i++;
            continue;
        }
        const c = [];
        while (i < L.length && L[i].trim() && (!c.length || !st(L[i])))
            c.push(L[i++]);
        o.push(nb('p', { text: c.join('\n') }));
    }
    return o;
}
const lines = b => { const c = [0, 0, 0]; return b.items.map(x => { c[x.l]++; for (let k = x.l + 1; k < 3; k++)
    c[k] = 0; return { l: x.l, t: x.t, d: x.d, p: b.type === 'ol' ? c[x.l] + '.' : b.type === 'task' ? (x.d ? '- [x] ' : '- [ ] ').trim() : '-' }; }); };
const slug = s => s.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
const heads = () => B.filter(b => b.type === 'h' && b.text.trim());
function md(b) {
    switch (b.type) {
        case 'h': return '#'.repeat(+b.level) + ' ' + b.text;
        case 'p': return b.text;
        case 'ul':
        case 'ol':
        case 'task': return lines(b).map(x => '  '.repeat(x.l) + x.p + ' ' + x.t).join('\n');
        case 'quote': return b.text.split('\n').map(x => '> ' + x).join('\n');
        case 'code': return '```' + b.lang + '\n' + b.text + '\n```';
        case 'table': {
            const r = b.rows, f = x => '| ' + x.join(' | ') + ' |';
            return [f(r[0]), f(r[0].map(() => '---')), ...r.slice(1).map(f)].join('\n');
        }
        case 'img': return `![${b.alt}](${b.url})`;
        case 'link': return `[${b.text || b.url}](${b.url})`;
        case 'hr': return '---';
        case 'note': return '> [!' + b.kind + ']\n' + b.text.split('\n').map(x => '> ' + x).join('\n');
        case 'det': return `<details>\n<summary>${b.sum}</summary>\n\n${b.text}\n\n</details>`;
        case 'toc': return heads().map(h => '  '.repeat(Math.max(0, h.level - 1)) + `- [${h.text}](#${slug(h.text)})`).join('\n') || '<!-- Add headings to build contents -->';
    }
}
const full = () => B.map(b => md(b) + mda(b)).join('\n\n') + '\n';
const safe = u => /^\s*(javascript|data|vbscript):/i.test(u) ? '#' : u;
const inl = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, a, u) => `<img alt="${a}" src="${safe(u)}">`).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${safe(u)}" target="_blank" rel="noopener">${t}</a>`).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<i style="font-style:italic;color:inherit;min-width:0">$2</i>').replace(/~~(.+?)~~/g, '<del>$1</del>').replace(/\n/g, '<br>');
function html(b) {
    switch (b.type) {
        case 'h': return `<h${b.level} id="${slug(b.text)}">${inl(b.text)}</h${b.level}>`;
        case 'p': return `<p>${inl(b.text)}</p>`;
        case 'ul':
        case 'ol':
        case 'task': return lines(b).map(x => `<div class="li" style="margin-left:${x.l * 1.4}em"><i>${b.type === 'task' ? (x.d ? '☑' : '☐') : b.type === 'ol' ? x.p : '•'}</i>${inl(x.t)}</div>`).join('');
        case 'quote': return `<blockquote>${inl(b.text)}</blockquote>`;
        case 'code': return `<pre><code>${esc(b.text)}</code></pre>`;
        case 'table': return '<table>' + b.rows.map((r, i) => '<tr>' + r.map(c => `<${i ? 'td' : 'th'}>${inl(c)}</${i ? 'td' : 'th'}>`).join('') + '</tr>').join('') + '</table>';
        case 'img': return b.url ? `<p><img alt="${at(b.alt)}" src="${at(safe(b.url))}" data-fallback="${at(b.alt || b.url)}"></p>` : '';
        case 'link': return `<p><a href="${at(safe(b.url))}" target="_blank" rel="noopener">${esc(b.text || b.url)}</a></p>`;
        case 'hr': return '<hr>';
        case 'note': return `<div class="al" style="--c:${KC[b.kind]}"><b>${b.kind[0] + b.kind.slice(1).toLowerCase()}</b><br>${inl(b.text)}</div>`;
        case 'det': return `<details open><summary>${inl(b.sum)}</summary>${inl(b.text)}</details>`;
        case 'toc': return '<div>' + heads().map(h => `<div class="li" style="margin-left:${(h.level - 1) * 1.2}em"><a href="#${slug(h.text)}">${esc(h.text)}</a></div>`).join('') + '</div>';
    }
}
function hl(s) { return s.split('\n').map(l => { let c = esc(l) || ' '; return `<div>${/^#{1,6}\s/.test(l) ? `<span class=k1>${c}</span>` : /^```/.test(l) ? `<span class=k3>${c}</span>` : /^\s*>/.test(l) ? `<span class=k4>${c}</span>` : /^\s*([-*]|\d+\.)\s/.test(l) || /^(---|\|)/.test(l) ? c.replace(/^(\s*(?:[-*]|\d+\.|\|)?(?:\s\[[ x]\])?)/, '<span class=k2>$1</span>') : c}</div>`; }).join(''); }
const atStr = b => (b.a || []).filter(x => /^[a-zA-Z_][\w:.-]*$/.test(x[0]) && !/^on/i.test(x[0]) && !/^(srcdoc|formaction)$/i.test(x[0])).map(x => ` ${x[0]}="${at(x[1])}"`).join('');
const hb = b => { const s = atStr(b); return s ? `<div${s}>${html(b)}</div>` : html(b); };
const mda = b => { if (!MDA)
    return ''; const L = (b.a || []).filter(x => x[0] && x[0] !== 'data-'); if (!L.length)
    return ''; return (b.type === 'h' ? ' ' : '\n') + '{' + L.map(([k, v]) => k === 'id' ? '#' + v : k === 'class' ? v.split(/\s+/).filter(Boolean).map(c => '.' + c).join(' ') : `${k}="${v}"`).join(' ') + '}'; };
