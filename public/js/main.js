/**
 * Boot: restore the saved page (or the welcome template) and render.
 */
try {
    const saved = localStorage.getItem('mdblocks.v1');
    const parsed = JSON.parse(saved || 'null');
    if (Array.isArray(parsed) && parsed.length) {
        const valid = parsed.filter(b => b && typeof b === 'object' && typeof b.type === 'string');
        if (valid.length) {
            B = valid;
            uid = Math.max(0, ...valid.map(b => Number(b.id) || 0));
        }
    }
}
catch (e) { }
if (!B.length) {
    B = parse(TPL.Welcome);
    toast('Welcome! Start with a template or paste markdown to begin.', 'Explore', () => {
        const tpl = document.getElementById('tpl');
        if (tpl) tpl.click();
    }, 5000);
}
draw();
out();
snap();
