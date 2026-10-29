/**
 * Global app state, DOM helpers and the block factory nb().
 */
let B = [], U = [], R = [], lastEl = null, tm, foc = null, view = 'r', uid = 0;
const $ = s => document.querySelector(s), esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'), at = s => esc(s).replace(/"/g, '&quot;');
const nb = (type, o) => Object.assign({ id: ++uid, type, c: 0, a: [], text: '', level: 2, lang: '', alt: '', url: '', kind: 'NOTE', sum: 'Details', items: [{ t: '', d: 0, l: 0 }], rows: [['Column', 'Column'], ['', '']] }, o);
let MDA = 0, UC = '';
