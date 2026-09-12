# Everaldo Filho

Landing page oficial de Everaldo Filho para aulas de guitarra, canto e o Método Guitarra Agressiva.

## Rodar localmente

Requer Node.js 20.19 ou superior.

```bash
npm ci
npm run dev
```

O projeto abre em `http://localhost:5173`.

## Verificação de produção

```bash
npm run check
```

O comando executa a checagem de tipos e gera o build de produção em `dist`.

Com o servidor local ativo, também estão disponíveis:

```bash
npm run qa
npm run audit
```

## Deploy na Vercel

1. Importe este repositório na Vercel.
2. Mantenha o framework detectado como **Vite**.
3. Publique. O build e a pasta de saída já estão definidos em `vercel.json`.

A landing page pode ser publicada sem credenciais. O checkout permanece indisponível até a integração real ser concluída; nenhuma cobrança ou liberação de acesso é simulada.

## Mídia

As sequências WebP e a faixa de áudio usadas pela página estão em `public/media`. O arquivo MP4 original serviu somente como referência para a extração dos frames e não é publicado pelo projeto.


## Planos e pagamentos

- Preços demonstrativos e benefícios: `src/data/plans.js`. Cobrança anual preparada e oculta até a definição de valores oficiais.
- Pré-checkout: `src/components/CheckoutDialog.jsx`. As quatro opções explicam cartão, Pix Automático, Pix comum e boleto; a seleção é informativa. A contratação continua pelo WhatsApp.
- Preparação do backend: `api/checkout.js`, `api/asaas/customer.js`, `api/asaas/subscription.js`, `api/asaas/webhook.js`. Respostas 501/503 bloqueiam operações ainda não implementadas.
- Copie `.env.example` apenas para desenvolvimento local. `ASAAS_API_KEY` e `ASAAS_WEBHOOK_SECRET` pertencem ao ambiente do servidor/Vercel, nunca a variáveis `VITE_*`.
- Ativação real ainda exige adaptador Asaas, autenticação, armazenamento persistente e idempotente de clientes/assinaturas/eventos, políticas comerciais definitivas, teste sandbox e confirmação via webhook. Uma chave isolada não ativa cobrança.
- O servidor resolve preço por `planId`. Redirects e parâmetros de URL não liberam acesso.
- Documentação consultada: https://docs.asaas.com/docs/pix-automatico e https://docs.asaas.com/docs/assinaturas.
- Testes mobile adicionais: `node scripts/mobile-qa.mjs` (Chrome local, servidor ativo).
