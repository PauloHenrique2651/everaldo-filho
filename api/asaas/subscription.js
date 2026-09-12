import { integrationPending, methodNotAllowed, requirePlan } from '../_shared.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') return methodNotAllowed(response);
  const plan = requirePlan(request.body?.planId, response);
  if (!plan) return;
  if (!process.env.ASAAS_API_KEY) return integrationPending(response);
  return response.status(501).json({ state: 'error', code: 'provider_adapter_pending', planId: plan.id });
}
