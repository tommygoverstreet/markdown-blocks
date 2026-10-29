/**
 * Per-block HTML attribute editor (id, class, style, data-*).
 */
const attr = (a, b, t) => { b.a = b.a || []; if (a === 'xt')
    b.ao = b.ao ? 0 : 1;
else if (a === 'xx')
    b.a.splice(+t.dataset.i, 1);
else
    b.a.push({ xa: ['', ''], xi: ['id', ''], xc: ['class', ''], xs: ['style', ''], xd: ['data-', ''] }[a].slice()); };
const apanel = b => `<div class="ap">${(b.a || []).map((x, i) => `<div class="row"><input data-ak="${i}" list="atl" value="${at(x[0])}" placeholder="id, class, style, data-…" style="flex:1 1 120px"><input data-av="${i}" value="${at(x[1])}" placeholder="value" style="flex:2 1 140px"><button class="ib" data-a="xx" data-i="${i}" title="Remove">✕</button></div>`).join('')}<div class="row">${[['xa', '+ Attribute'], ['xi', '+ id'], ['xc', '+ class'], ['xs', '+ style'], ['xd', '+ data-']].map(([a, n]) => `<button class="btn" data-a="${a}">${n}</button>`).join('')}</div></div>`;
document.body.insertAdjacentHTML('beforeend', '<datalist id="atl">' + ['id', 'class', 'style', 'title', 'role', 'lang', 'hidden', 'aria-label', 'data-'].map(x => `<option value="${x}">`).join('') + '</datalist>');
