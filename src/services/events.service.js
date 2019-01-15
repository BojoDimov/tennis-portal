export function dispatchEvent(name, options) {
  const root = document.getElementById('root');
  const event = new CustomEvent(name, { detail: options });
  root.dispatchEvent(event);
}

export function catchEvent(name, cb) {
  const root = document.getElementById('root');
  const listener = customEventListener.bind(null, cb);
  root.removeEventListener(name, listener);
  root.addEventListener(name, listener);
}

function customEventListener(cb, event) {
  return cb(event.detail);
}

export default {
  dispatchEvent,
  catchEvent
};