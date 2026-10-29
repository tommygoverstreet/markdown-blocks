/**
 * Toast notifications: toast(message, actionLabel?, onAction?, ms?).
 */
const toast = (() => {
    const host = document.createElement('div');
    host.id = 'toasts';
    host.setAttribute('role', 'status');
    host.setAttribute('aria-live', 'polite');
    document.body.appendChild(host);
    return (message, label, onAction, ms = 4500) => {
        const el = document.createElement('div');
        el.className = 'toast';
        const text = document.createElement('span');
        text.textContent = message;
        el.append(text);
        const close = () => el.remove();
        if (label) {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.onclick = () => { if (onAction)
                onAction(); close(); };
            el.append(btn);
        }
        host.append(el);
        setTimeout(close, ms);
    };
})();
