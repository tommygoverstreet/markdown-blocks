/**
 * Undo/redo snapshots.
 */
function snap() { const j = JSON.stringify(B); if (U[U.length - 1] !== j) {
    U.push(j);
    if (U.length > 100)
        U.shift();
    R = [];
} btns(); }
const touch = () => { out(); clearTimeout(tm); tm = setTimeout(snap, 500); };
const btns = () => { $('#un').disabled = U.length < 2; $('#re').disabled = !R.length; };
const jump = s => { B = JSON.parse(s); draw(); out(); btns(); };
$('#un').onclick = () => { clearTimeout(tm); snap(); if (U.length > 1) {
    R.push(U.pop());
    jump(U[U.length - 1]);
} };
$('#re').onclick = () => { if (R.length) {
    const s = R.pop();
    U.push(s);
    jump(s);
} };
