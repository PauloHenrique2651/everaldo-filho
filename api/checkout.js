import { integrationPending, methodNotAllowed, requirePlan } from './_shared.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') return methodNotAllowed(response);
  const plan = requirePlan(request.body?.planId, response);
  if (!plan) return;
  if (!process.env.ASAAS_API_KEY) return integrationPending(response);

  // O adaptador do Asaas será conectado aqui. O servidor resolve o preço pelo planId;
  // nenhum valor enviado pelo navegador é usado como fonte de verdade.
  return response.status(501).json({ state: 'error', code: 'provider_adapter_pending', planId: plan.id, message: 'Integração do provedor pendente.' });
}
