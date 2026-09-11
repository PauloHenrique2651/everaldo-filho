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

Não há variáveis de ambiente nem backend para configurar.

## Mídia

As sequências WebP e a faixa de áudio usadas pela página estão em `public/media`. O arquivo MP4 original serviu somente como referência para a extração dos frames e não é publicado pelo projeto.
