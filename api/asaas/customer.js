import { integrationPending, methodNotAllowed } from '../_shared.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') return methodNotAllowed(response);
  if (!process.env.ASAAS_API_KEY) return integrationPending(response);
  return response.status(501).json({ state: 'error', code: 'provider_adapter_pending' });
}
