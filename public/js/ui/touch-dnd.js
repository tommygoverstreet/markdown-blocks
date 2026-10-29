/**
 * Touch and pen drag-to-reorder using pointer events (HTML5 drag and drop does not fire on touch screens).
 */
(() => {
    const list = $('#cvs');
    const scroller = $('#cv');
    let drag = null;
    const showDrop = (y) => {
        rmDrop();
        const marker = document.createElement('div');
        marker.className = 'drop';
        const next = list.querySelectorAll('.bk')[idx(y)];
        next ? list.insertBefore(marker, next) : list.appendChild(marker);
    };
    list.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' || !e.target.classList.contains('hd'))
            return;
        const el = e.target.closest('.bk');
        drag = { id: el.dataset.id };
        el.classList.add('dragging');
        e.target.setPointerCapture(e.pointerId);
        if (navigator.vibrate)
            navigator.vibrate(10);
    });
    list.addEventListener('pointermove', (e) => {
        if (!drag)
            return;
        e.preventDefault();
        const r = scroller.getBoundingClientRect();
        if (e.clientY < r.top + 60)
            scroller.scrollTop -= 14;
        else if (e.clientY > r.bottom - 60)
            scroller.scrollTop += 14;
        showDrop(e.clientY);
    });
    list.addEventListener('pointerup', (e) => {
        if (!drag)
            return;
        const to = bi(idx(e.clientY));
        const from = find(drag.id);
        rmDrop();
        drag = null;
        const [block] = B.splice(from, 1);
        B.splice(from < to ? to - 1 : to, 0, block);
        draw();
        out();
        snap();
    });
    list.addEventListener('pointercancel', () => {
        drag = null;
        rmDrop();
        draw();
    });
})();
