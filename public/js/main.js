/**
 * Boot: restore the saved page (or the welcome template) and render.
 */
try {
    const s = JSON.parse(localStorage.getItem('mdblocks.v1'));
    if (Array.isArray(s) && s.length) {
        B = s;
        uid = Math.max(...s.map(b => b.id));
    }
}
catch (e) { }
if (!B.length)
    B = parse(TPL.Welcome);
draw();
out();
snap();
