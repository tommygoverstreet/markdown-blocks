/*
 * Boot: restore saved pages (or migrate the old single document, or the
 * welcome template) and render.
 */
loadPages();
if (!PAGES.length) {
    PAGES.push(newPage('Welcome', parse(TPL.Welcome)));
    savePages();
    toast('Welcome! Start with a template or paste markdown to begin.', 'Explore', () => {
        const tpl = document.getElementById('tpl');
        if (tpl) tpl.click();
    }, 5000);
}
{
    let last = null;
    try {
        last = localStorage.getItem(CURK);
    }
    catch (e) { }
    curPage = PAGES.find(p => p.id === last) || PAGES[0];
}
B = curPage.blocks;
uid = Math.max(uid, maxUid());
renderPages();
renderPageHead();
draw();
out();
snap();
