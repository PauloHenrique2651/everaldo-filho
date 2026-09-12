import { integrationPending, methodNotAllowed, requirePlan } from '../_shared.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') return methodNotAllowed(response);
  const plan = requirePlan(request.body?.planId, response);
  if (!plan) return;
  if (!process.env.ASAAS_API_KEY) return integrationPending(response);
  // Reserved for the real Pix Automatic authorization journey. An ACTIVE
  // authorization must come from verified provider events, never this request.
  return response.status(501).json({ state: 'error', code: 'authorization_adapter_pending', planId: plan.id });
}
