export function iife (func) {
  return typeof func === 'function' && func();
}

export function detectMobileDevice (ua) {
  if (!ua && globalThis.AGENT) return globalThis.AGENT;
  if (!ua && globalThis.navigator) ua = globalThis.navigator.userAgent;
  if (!ua) return 'mobile';

  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase());
  return isMobile ? 'mobile' : 'desktop';
}
