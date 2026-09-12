import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown,
  CirclePlay, Flame, Guitar, Headphones, LayoutDashboard, LockKeyhole,
  Mic2, Minus, Music2, Play, Plus, Radio, Sparkles, Target, Users,
} from 'lucide-react';
import useCinematicScroll from './hooks/useCinematicScroll';
import { comparison, formatPrice, plans } from './data/plans';
import { track } from './lib/analytics';

const outcomes = [
  ['Aulas soltas', 'Trilha estruturada'],
  ['Exercícios sem direção', 'Método progressivo'],
  ['Teoria sem aplicação', 'Prática com intenção'],
  ['Travar no improviso', 'Repertório e fraseado'],
  ['Não saber o que estudar', 'Próximo passo claro'],
  ['Evolução lenta', 'Progresso visível'],
];

export function TransformationStory() {
  const ref = useRef(null);
  const { active, reduced } = useCinematicScroll(ref, 3);

  useEffect(() => {
    const section = ref.current;
    if (!section || reduced || matchMedia('(pointer: coarse)').matches) return undefined;
    let frame = 0;
    const move = event => {
      const bounds = section.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > innerHeight) return;
      const x = event.clientX / innerWidth - .5;
      const y = event.clientY / innerHeight - .5;
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        section.style.setProperty('--pointer-x', x.toFixed(4));
        section.style.setProperty('--pointer-y', y.toFixed(4));
      });
    };
    addEventListener('pointermove', move, { passive: true });
    return () => { removeEventListener('pointermove', move); if (frame) cancelAnimationFrame(frame); };
  }, [reduced]);

  return <section ref={ref} id="transformacao" className={`transformation-story ${reduced ? 'is-static' : ''}`} data-scene={active}>
    <div className="transformation-stage">
      <div className="transformation-world" aria-hidden="true">
        <img src="/media/guitar-focus.webp" alt="" loading="lazy" />
        <i className="transformation-light" />
        <i className="transformation-grid" />
      </div>
      <div className="transformation-progress" aria-hidden="true"><span>02 / IDENTIFICAÇÃO</span><i><b /></i><span>04 / MECANISMO</span></div>
      <article className={`story-beat story-beat-problem ${active === 0 ? 'is-active' : ''}`}>
        <span>O PROBLEMA NÃO É FALTA DE VONTADE</span>
        <h2>Você não precisa de mais<br /><em>vídeos aleatórios.</em></h2>
        <p>Conteúdo sem sequência ocupa tempo. Um método mostra o próximo movimento.</p>
      </article>
      <article className={`story-beat story-beat-path ${active === 1 ? 'is-active' : ''}`}>
        <header><span>ANTES</span><h2>Você precisa<br />de um <em>caminho.</em></h2><strong>COM O STUDIO</strong></header>
        <div className="transformation-list">{outcomes.map(([before, after], index) => <div key={before} style={{ '--delay': index }}><span><Minus />{before}</span><i /><strong><Check />{after}</strong></div>)}</div>
      </article>
      <article className={`story-beat story-beat-resolution ${active === 2 ? 'is-active' : ''}`}>
        <span>TÉCNICA · EXPRESSÃO · DIREÇÃO</span>
        <h2>Técnica sem expressão<br />é só movimento.</h2>
        <h3>Expressão sem técnica<br />é limitação.</h3>
        <strong>Domine os dois.</strong>
        <a href="#metodo">Conheça o método <ArrowDown /></a>
      </article>
    </div>
  </section>;
}

const voicePillars = ['Técnica vocal', 'Respiração', 'Apoio', 'Afinação', 'Extensão', 'Interpretação', 'Presença', 'Resistência'];

export function SingingSection() {
  return <section id="canto" className="singing section-shell">
    <div className="singing-copy">
      <span>VOZ / PRESENÇA / CONTROLE</span>
      <h2>Sua voz também<br />é um <em>instrumento.</em></h2>
      <p>Respiração, afinação e interpretação trabalham juntas para que sua voz tenha mais liberdade, resistência e intenção.</p>
      <a href="#planos" onClick={() => track('singing_selected', { source: 'singing_section' })}>Quero desenvolver minha voz <ArrowUpRight /></a>
    </div>
    <div className="voice-system" aria-label="Pilares do desenvolvimento vocal">
      <div className="voice-core"><Mic2 /><span>RESPIRAR</span><strong>INTERPRETAR</strong></div>
      <div className="voice-rings" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="voice-pills">{voicePillars.map((pillar, index) => <span key={pillar} style={{ '--voice-index': index }}>{String(index + 1).padStart(2, '0')} — {pillar}</span>)}</div>
    </div>
  </section>;
}

export function PlatformPreview() {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    let sent = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !sent) { sent = true; track('platform_preview_viewed'); }
    }, { threshold: .35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const nav = [
    [LayoutDashboard, 'Início'], [Target, 'Minha jornada'], [Guitar, 'Guitarra'],
    [Mic2, 'Canto'], [BookOpen, 'Cursos'], [Headphones, 'Backing tracks'],
    [Radio, 'Ao vivo'], [Users, 'Comunidade'],
  ];
  return <section ref={ref} id="studio" className="platform section-shell">
    <div className="platform-head">
      <span>05 / PRODUTO</span>
      <h2>Tudo dentro de<br />uma única <em>plataforma.</em></h2>
      <p>Uma assinatura pensada para organizar o estudo, mostrar o próximo passo e reunir guitarra, canto e prática em um só lugar.</p>
    </div>
    <div className="studio-device">
      <div className="device-top"><span /><span /><span /><b>studio.everaldo</b><small>PREVIEW</small></div>
      <div className="studio-ui">
        <aside className="studio-sidebar">
          <div className="studio-logo"><b>EF</b><span>STUDIO<br />EVERALDO FILHO</span></div>
          <nav aria-label="Prévia da navegação do Studio">{nav.map(([Icon, label], index) => <span className={index === 1 ? 'is-active' : ''} key={label}><Icon />{label}</span>)}</nav>
          <div className="studio-profile"><i>EF</i><span>Área do aluno<small>Plano demonstrativo</small></span></div>
        </aside>
        <div className="studio-dashboard">
          <header><div><span>MINHA JORNADA</span><h3>Continue de onde parou.</h3></div><Radio aria-hidden="true" /></header>
          <div className="studio-course">
            <img src="/media/hero.webp" alt="" loading="lazy" />
            <div className="course-shade" />
            <div className="course-copy"><span>GUITARRA AGRESSIVA™</span><h4>Construção de frases<br />sobre pentatônica</h4><div><a href="#metodo"><Play /> Explorar o método</a><small>PRÓXIMA AULA · PREVIEW</small></div></div>
            <div className="course-progress"><span>PROGRESSO DEMONSTRATIVO</span><strong>68%</strong><i><b /></i></div>
          </div>
          <div className="studio-widgets">
            <article><Flame /><span>SEQUÊNCIA DEMONSTRATIVA</span><strong>12 dias</strong><small>Exemplo visual do produto</small></article>
            <article><Target /><span>SEU PROGRESSO</span><strong>Próximo marco</strong><i><b /></i><small>Trilha intermediária</small></article>
            <article><Music2 /><span>OUÇA UMA REFERÊNCIA</span><strong>Guitarra em cena</strong><a href="#escuta" aria-label="Ir ao player de áudio"><CirclePlay /></a></article>
          </div>
          <nav className="studio-bottom-nav" aria-label="Explorar o Studio"><a href="#metodo"><Guitar />Guitarra</a><a href="#canto"><Mic2 />Canto</a><a href="#planos"><LayoutDashboard />Planos</a></nav>
        </div>
      </div>
    </div>
    <p className="platform-disclaimer"><Sparkles /> Preview conceitual da plataforma. Os dados exibidos são demonstrativos e não pertencem ao visitante.</p>
  </section>;
}

export function HowItWorks() {
  const steps = [
    ['01', 'Escolha seu plano', 'Guitarra ou canto.'],
    ['02', 'Entre no Studio', 'Acesso após a confirmação do pagamento.'],
    ['03', 'Siga sua trilha', 'Saiba o que estudar sem procurar aleatoriamente.'],
    ['04', 'Evolua', 'Aulas, exercícios e desafios conectados.'],
  ];
  return <section id="como-funciona" className="how section-shell">
    <header><span>UMA JORNADA, NÃO UMA PILHA DE AULAS</span><h2>Da escolha<br />à <em>evolução.</em></h2></header>
    <div className="how-steps">{steps.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p><ArrowRight /></article>)}</div>
  </section>;
}

export function ProofSection() {
  const placeholders = [
    { category: 'Guitarra', label: 'Relato verificado em preparação' },
    { category: 'Canto', label: 'Relato verificado em preparação' },
    { category: 'Método', label: 'Relato verificado em preparação' },
  ];
  return <section id="historias" className="proof section-shell">
    <header><span>PROVA SEM ATALHO</span><h2>Histórias reais.<br /><em>Sem roteiro.</em></h2><p>Esta área só será publicada com relatos autorizados de alunos. Nenhum nome, número ou resultado foi inventado.</p></header>
    <div className="proof-placeholders">{placeholders.map(item => <article key={item.category}><span>{item.category}</span><div aria-hidden="true"><i /><i /><i /><i /></div><strong>{item.label}</strong><small>PLACEHOLDER IDENTIFICADO</small></article>)}</div>
  </section>;
}

function PricingCard({ plan, category, onSelect }) {
  const cardRef = useRef(null);
  const tilt = event => {
    if (!plan.highlighted || matchMedia('(pointer: coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    cardRef.current.style.setProperty('--price-tilt-x', `${-y * 2}deg`);
    cardRef.current.style.setProperty('--price-tilt-y', `${x * 2}deg`);
  };
  const reset = () => {
    cardRef.current?.style.setProperty('--price-tilt-x', '0deg');
    cardRef.current?.style.setProperty('--price-tilt-y', '0deg');
  };
  return <article ref={cardRef} className={`pricing-card pricing-${plan.tier} ${plan.highlighted ? 'is-highlighted' : ''}`} onPointerMove={tilt} onPointerLeave={reset}>
    <header><span>{plan.badge || (plan.tier === 'basic' ? 'PORTA DE ENTRADA' : 'MAIS PROXIMIDADE')}</span><b>{category === 'guitar' ? 'GUITARRA' : 'CANTO'}</b></header>
    <h3>{plan.name}</h3>
    <p>{plan.description}</p>
    <div className="plan-price"><strong>{formatPrice(plan.monthlyPrice)}</strong><small>/mês</small></div>
    <small className="example-price">VALOR DE CONFIGURAÇÃO · EXEMPLO</small>
    <button onClick={() => onSelect(plan)}>{plan.cta}<ArrowUpRight /></button>
    <ul>{plan.benefits.map(benefit => <li key={benefit}><Check />{benefit}</li>)}</ul>
  </article>;
}

function PlanComparison({ category }) {
  const [open, setOpen] = useState(1);
  const names = plans[category].map(plan => plan.name);
  return <div className="comparison">
    <header><span>SEM LETRA MIÚDA</span><h3>Compare os planos.</h3></header>
    <div className="comparison-table" role="table" aria-label="Comparação dos planos">
      <div role="row" className="comparison-row comparison-heading"><span role="columnheader">Recurso</span>{names.map(name => <strong role="columnheader" key={name}>{name}</strong>)}</div>
      {comparison.map(([feature, ...values]) => <div role="row" className="comparison-row" key={feature}><span role="cell">{feature === 'Guitarra Agressiva' && category === 'singing' ? 'Trilha vocal completa' : feature}</span>{values.map((value, index) => <i role="cell" aria-label={value ? 'Incluído' : 'Não incluído'} key={names[index]}>{value ? <Check /> : <Minus />}</i>)}</div>)}
    </div>
    <div className="comparison-mobile">{names.map((name, index) => <article className={open === index ? 'is-open' : ''} key={name}><button onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}><span>{name}</span>{open === index ? <Minus /> : <Plus />}</button><div hidden={open !== index}>{comparison.map(([feature, ...values]) => <p key={feature}><span>{feature === 'Guitarra Agressiva' && category === 'singing' ? 'Trilha vocal completa' : feature}</span>{values[index] ? <Check /> : <Minus />}</p>)}</div></article>)}</div>
  </div>;
}

export function PricingSection({ onSelect }) {
  const [category, setCategory] = useState('guitar');
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    let sent = false;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !sent) { sent = true; track('pricing_viewed'); } }, { threshold: .2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const chooseCategory = next => {
    setCategory(next);
    track(next === 'guitar' ? 'guitar_selected' : 'singing_selected', { source: 'pricing' });
  };
  const selectPlan = plan => {
    track('plan_selected', { plan_id: plan.id, category: plan.category, tier: plan.tier });
    track(`${plan.tier}_selected`, { plan_id: plan.id });
    onSelect(plan);
  };
  return <section ref={ref} id="planos" className="pricing section-shell">
    <header className="pricing-head"><div><span>07 / OFERTA</span><h2>Escolha como<br />você quer <em>evoluir.</em></h2></div><p>Todos os planos abrem a porta do Studio. O nível de profundidade muda com o seu momento.</p></header>
    <div className="course-switcher" role="tablist" aria-label="Modalidade dos planos">
      {['guitar', 'singing'].map(value => <button key={value} id={`plans-tab-${value}`} role="tab" aria-controls="plans-panel" tabIndex={category === value ? 0 : -1} aria-selected={category === value} onClick={() => chooseCategory(value)} onKeyDown={event => {
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
          const next = event.key === 'Home' ? 'guitar' : event.key === 'End' ? 'singing' : category === 'guitar' ? 'singing' : 'guitar';
          chooseCategory(next); document.getElementById(`plans-tab-${next}`).focus();
        }
      }}>{value === 'guitar' ? <Guitar /> : <Mic2 />}{value === 'guitar' ? 'Guitarra' : 'Canto'}</button>)}
      <span>ASSINATURA MENSAL</span>
    </div>
    <div id="plans-panel" role="tabpanel" aria-labelledby={`plans-tab-${category}`} className="pricing-grid">{plans[category].map(plan => <PricingCard plan={plan} category={category} onSelect={selectPlan} key={plan.id} />)}</div>
    <PlanComparison category={category} />
  </section>;
}

export function FinalCTA({ onSelect }) {
  const premium = plans.guitar.find(plan => plan.highlighted);
  return <section id="comecar" className="final-cta">
    <img src="/media/method.webp" alt="" loading="lazy" />
    <div className="final-cta-shade" />
    <div className="final-cta-copy">
      <span>O PRÓXIMO COMPASSO COMEÇA AGORA</span>
      <h2>O próximo nível<br />não vai chegar <em>sozinho.</em></h2>
      <p>Você já sabe o que quer tocar. Agora é hora de construir a técnica para chegar lá.</p>
      <div><button onClick={() => onSelect(premium)}>Começar minha evolução <ArrowUpRight /></button><a href="#planos">Ver planos <ArrowDown /></a></div>
    </div>
  </section>;
}

export function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const progress = max > 0 ? scrollY / max : 0;
      ref.current?.style.setProperty('--page-progress', String(progress));
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', request);
    return () => { removeEventListener('scroll', request); removeEventListener('resize', request); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return <div ref={ref} className="page-progress" aria-hidden="true"><i /></div>;
}
