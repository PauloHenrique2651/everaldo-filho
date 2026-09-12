export const checkoutConfig = {
  enabled: import.meta.env.VITE_CHECKOUT_ENABLED === 'true',
  endpoint: '/api/checkout',
  provider: 'Asaas',
};

export const checkoutStates = ['idle', 'loading', 'pending', 'processing', 'approved', 'declined', 'authorization_pending', 'expired', 'cancelled', 'error'];
export const paymentStatusLabels = { pending: 'Aguardando pagamento', processing: 'Processando', approved: 'Pagamento confirmado', declined: 'Pagamento recusado', authorization_pending: 'Autorização pendente', active: 'Assinatura ativa', overdue: 'Assinatura vencida', error: 'Não foi possível concluir. Tente novamente ou fale com Everaldo.' };
export const subscriptionStates = ['pending', 'active', 'overdue', 'cancelled', 'expired', 'payment_failed'];
