# Everaldo Filho — direção “Cadeia de Sinal”

## Objetivo

Transformar a página em uma experiência autoral de músico para músico e conduzir visitantes qualificados a uma conversa no WhatsApp sobre aulas de guitarra, canto ou o Método Guitarra Agressiva.

## Direção visual

A interface nasce de materiais presentes no universo da guitarra: palco preto, papel de partitura, luz vermelha de válvula, madeira e metal. O resultado combina fotografia cinematográfica, tipografia condensada de grande escala e detalhes técnicos mínimos. Não há estética de infoproduto, cards flutuantes genéricos ou efeitos cósmicos literais.

Tokens principais:

- Carbono: `#090908`
- Carvão: `#141310`
- Papel: `#F1E9DA`
- Sinal: `#F0522D`
- Madeira: `#A96B3D`
- Aço: `#A5A69F`

Tipografia:

- Display: Big Shoulders Display Variable
- Texto: Space Grotesk Variable
- Dados e legendas: IBM Plex Mono

## Narrativa

1. **Presença:** Everaldo ocupa o hero em uma sequência de 100 frames. A mensagem abre com “Improviso não se decora” e resolve em “Você constrói”.
2. **Tese:** uma seção clara declara que técnica vira música quando existe intenção.
3. **Cadeia de sinal:** a sequência de 100 frames da guitarra apresenta três decisões: ouvir, escolher e assinar a frase.
4. **Método:** os quatro pilares ganham interação direta e uma composição editorial assimétrica.
5. **Aulas:** guitarra e canto aparecem como dois caminhos com linguagem própria e CTA específico.
6. **Escuta e professor:** o áudio fornecido vira um player tátil inspirado no componente enviado; a presença de Everaldo permanece central.
7. **Conversa:** o visitante escolhe interesse, momento e objetivo antes de abrir o WhatsApp.

## Interação e performance

As duas sequências de frames usam canvas, carregamento progressivo e cache limitado. O movimento acompanha o scroll nativo e é removido quando `prefers-reduced-motion` ou economia de dados estiverem ativos. O áudio só começa por ação explícita. Todos os controles têm nome acessível, foco visível e alvos de toque adequados.

## Entrega

Projeto Vite/React estático, configurado para build na Vercel. A validação cobre TypeScript, build de produção, console do navegador, links internos, WhatsApp, ausência de vídeo MP4 no runtime, responsividade em 375/768/1440 e redução de movimento.
