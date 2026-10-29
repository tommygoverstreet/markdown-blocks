/**
 * Small UX helpers: loadMd (replace page with undo toast), empty-state actions, image fallbacks, shortcuts, theme-color sync.
 */
/** Replace the whole page with parsed markdown and offer an undo. */
const loadMd = (markdown) => {
    B = parse(markdown);
    draw();
    out();
    snap();
    toast('Page replaced', 'Undo', () => $('#un').click());
};
// Empty-state buttons.
$('#cvs').addEventListener('click', (e) => {
    const t = e.target.closest('.empty [data-tp], .empty [data-k]');
    if (!t)
        return;
    if (t.dataset.tp)
        loadMd(TPL[t.dataset.tp]);
    else
        add(t.dataset.k);
});
// Replace broken preview images with their alt text (CSP-safe, no inline handlers).
document.addEventListener('error', (e) => {
    const img = e.target;
    if (img.tagName !== 'IMG' || img.dataset.fallback === undefined)
        return;
    const code = document.createElement('code');
    code.textContent = 'Image: ' + img.dataset.fallback;
    img.replaceWith(code);
}, true);
// Ctrl/Cmd+S exports the markdown file.
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        $('#ex').click();
    }
});
$('#cp').addEventListener('click', () => toast('Markdown copied'));
// Keep the browser chrome colour in sync with the active theme.
const metaTheme = document.querySelector('meta[name="theme-color"]');
const syncThemeColor = () => {
    const c = getComputedStyle(document.documentElement).getPropertyValue('--pn').trim();
    if (metaTheme && c)
        metaTheme.content = c;
};
new MutationObserver(syncThemeColor).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncThemeColor);
syncThemeColor();
