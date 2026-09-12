export const paymentMethods = ['credit_card', 'pix', 'boleto'];
export const reservedPaymentMethods = ['automatic_pix'];
export const pricingConfig = { isExample: true, annualEnabled: false };
export const paymentOptions = [
  { id: 'credit_card', name: 'Cartão de crédito', description: 'Cobrança automática a cada ciclo.', detail: 'O cartão será validado no checkout seguro para as próximas cobranças.' },
  { id: 'automatic_pix', name: 'Pix Automático', description: 'Autorize uma vez e simplifique os próximos pagamentos.', detail: 'Autorize o Studio no seu banco uma única vez. A ativação depende da confirmação do banco.', reserved: true },
  { id: 'pix', name: 'Pix', description: 'Pague cada cobrança por QR Code ou Pix Copia e Cola.', detail: 'O código Pix será gerado ao iniciar uma cobrança real. Você paga cada ciclo pelo aplicativo do seu banco.' },
  { id: 'boleto', name: 'Boleto', description: 'Receba uma nova cobrança a cada ciclo da assinatura.', detail: 'Cada boleto precisa ser pago até o vencimento. A confirmação depende da compensação.' },
];

const shared = {
  billingCycle: 'monthly',
  annualPrice: null,
  checkoutId: null,
  availablePaymentMethods: paymentMethods,
  enabled: true,
};

export const plans = {
  guitar: [
    {
      ...shared,
      id: 'guitar-basic', slug: 'guitarra-basico', category: 'guitar', tier: 'basic',
      name: 'Básico', monthlyPrice: 79.9, highlighted: false,
      description: 'Para começar com uma trilha estruturada e parar de estudar sem direção.',
      benefits: ['Studio Everaldo Filho', 'Curso completo de guitarra', 'Trilha para iniciantes', 'Exercícios progressivos', 'Biblioteca de aulas gravadas', 'Backing tracks', 'Material complementar', 'Acesso no celular e computador'],
      cta: 'Começar no Básico',
    },
    {
      ...shared,
      id: 'guitar-premium', slug: 'guitarra-premium', category: 'guitar', tier: 'premium',
      name: 'Premium', monthlyPrice: 149.9, highlighted: true, badge: 'Mais escolhido',
      description: 'Para acelerar a evolução e transformar recurso técnico em linguagem musical.',
      benefits: ['Tudo do Básico', 'Método Guitarra Agressiva™', 'Trilhas intermediárias e avançadas', 'Improvisação e escalas aplicadas', 'Fraseado e harmonia prática', 'Técnicas avançadas', 'Desafios e novas aulas', 'Conteúdos exclusivos', 'Comunidade', 'Sessões coletivas quando disponíveis'],
      cta: 'Quero evoluir mais rápido',
    },
    {
      ...shared,
      id: 'guitar-pro', slug: 'guitarra-pro', category: 'guitar', tier: 'pro',
      name: 'Pro', monthlyPrice: 397, highlighted: false, badge: 'Acompanhamento próximo',
      description: 'Para quem quer orientação próxima, feedback e um plano de estudos individual.',
      benefits: ['Tudo do Premium', 'Aulas ao vivo', 'Acompanhamento individual', 'Análise da evolução', 'Feedback de execução', 'Orientação personalizada', 'Plano de estudos individual', 'Correção de técnica', 'Prioridade no suporte'],
      cta: 'Quero acompanhamento Pro',
    },
  ],
  singing: [
    {
      ...shared,
      id: 'singing-basic', slug: 'canto-basico', category: 'singing', tier: 'basic',
      name: 'Básico', monthlyPrice: 79.9, highlighted: false,
      description: 'Uma base clara para desenvolver a voz com prática e direção.',
      benefits: ['Studio Everaldo Filho', 'Aulas gravadas', 'Técnica vocal', 'Respiração', 'Afinação', 'Exercícios', 'Material de apoio'],
      cta: 'Começar no Básico',
    },
    {
      ...shared,
      id: 'singing-premium', slug: 'canto-premium', category: 'singing', tier: 'premium',
      name: 'Premium', monthlyPrice: 149.9, highlighted: true, badge: 'Mais escolhido',
      description: 'Para construir uma voz mais livre, resistente e presente.',
      benefits: ['Tudo do Básico', 'Extensão vocal', 'Interpretação e performance', 'Resistência', 'Repertório', 'Exercícios avançados', 'Desafios', 'Conteúdos exclusivos', 'Comunidade'],
      cta: 'Quero evoluir minha voz',
    },
    {
      ...shared,
      id: 'singing-pro', slug: 'canto-pro', category: 'singing', tier: 'pro',
      name: 'Pro', monthlyPrice: 397, highlighted: false, badge: 'Acompanhamento próximo',
      description: 'Para desenvolver a voz com análise individual e orientação contínua.',
      benefits: ['Tudo do Premium', 'Aulas ao vivo', 'Análise vocal', 'Feedback individual', 'Acompanhamento próximo', 'Orientação personalizada', 'Plano de desenvolvimento'],
      cta: 'Quero acompanhamento Pro',
    },
  ],
  combo: [
    {
      ...shared,
      enabled: false,
      id: 'studio-complete', slug: 'studio-completo', category: 'combo', tier: 'premium',
      name: 'Studio Completo', monthlyPrice: 199.9, highlighted: true, badge: 'Em preparação',
      description: 'Guitarra e canto em uma única assinatura.', benefits: [], cta: 'Entrar para o Studio',
    },
  ],
};

export const comparison = [
  ['Studio', true, true, true], ['Aulas gravadas', true, true, true], ['Trilhas completas', true, true, true],
  ['Conteúdo avançado', false, true, true], ['Guitarra Agressiva', false, true, true], ['Comunidade', false, true, true],
  ['Conteúdo exclusivo', false, true, true], ['Feedback', false, false, true], ['Aulas ao vivo', false, false, true],
  ['Plano individual', false, false, true], ['Acompanhamento', false, false, true],
];

export const findPlan = planId => Object.values(plans).flat().find(plan => plan.id === planId && plan.enabled);
export const formatPrice = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
