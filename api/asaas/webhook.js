import { timingSafeEqual } from 'node:crypto';
import { integrationPending, methodNotAllowed } from '../_shared.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') return methodNotAllowed(response);
  const expected = process.env.ASAAS_WEBHOOK_SECRET;
  if (!expected) return integrationPending(response);
  const provided = request.headers?.['asaas-access-token'];
  if (typeof provided !== 'string' || Buffer.byteLength(provided) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(provided), Buffer.from(expected))) {
    return response.status(401).json({ state: 'error', code: 'invalid_webhook_token' });
  }
  // No acknowledgement until durable event storage, idempotency and account
  // entitlement updates are implemented. Redirects never activate access.
  return response.status(503).json({ state: 'error', code: 'event_storage_pending' });
}
