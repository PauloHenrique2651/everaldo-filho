export function track(event, properties = {}) {
  if (typeof window === 'undefined') return;
  const payload = { event, ...properties };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent('studio:analytics', { detail: payload }));
}
