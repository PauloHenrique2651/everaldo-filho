import { findPlan } from '../src/data/plans.js';

export function methodNotAllowed(response, allowed = 'POST') {
  response.setHeader('Allow', allowed);
  return response.status(405).json({ state: 'error', message: 'Método não permitido.' });
}

export function requirePlan(planId, response) {
  const plan = findPlan(planId);
  if (!plan) {
    response.status(400).json({ state: 'error', message: 'Plano inválido ou indisponível.' });
    return null;
  }
  return plan;
}

export function integrationPending(response) {
  return response.status(503).json({ state: 'error', code: 'checkout_not_configured', message: 'O checkout ainda está sendo configurado.' });
}
