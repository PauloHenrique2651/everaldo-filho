import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, AudioLines, Check, Instagram,
  LockKeyhole, Menu, MessageCircle, Minus, Plus, X,
} from 'lucide-react';
import ScrollPerformance, { useReducedMotion } from './ScrollPerformance';
import GuitarHorizon from './GuitarHorizon';
import PerformancePlayer from './PerformancePlayer';
import SoundControl from './SoundControl';
import CheckoutDialog from './components/CheckoutDialog';
import {
  FinalCTA, HowItWorks, PlatformPreview, PricingSection, ProofSection,
  ScrollProgress, SingingSection, TransformationStory,
} from './StudioSections';
import { track } from './lib/analytics';
import './styles.css';

const phone = '5521975769161';
const instagram = 'https://www.instagram.com/everaldofilho.gtr/';
const wa = (message = 'Olá, Everaldo! Quero saber mais sobre o Studio Everaldo Filho.') => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

const pillars = [
  { key: '01', title: 'Técnica', line: 'Controle antes da velocidade.', detail: 'Precisão, articulação e dinâmica. Bends, vibratos e palhetada entram a serviço da música.' },
  { key: '02', title: 'Harmonia', line: 'Entenda o terreno antes do salto.', detail: 'Leia a base, reconheça funções e saiba por que uma nota cria tensão ou resolução.' },
  { key: '03', title: 'Improvisação', line: 'Escolha enquanto a música acontece.', detail: 'Conecte ideias pelo braço e construa caminhos sem voltar sempre às mesmas frases.' },
  { key: '04', title: 'Fraseado', line: 'Faça cada nota ter intenção.', detail: 'Ritmo, silêncio, ataque e duração transformam escala em discurso musical.' },
  { key: '05', title: 'Repertório', line: 'Amplie o que você consegue dizer.', detail: 'Absorva referências e aplique recursos em contextos que realmente soam como música.' },
  { key: '06', title: 'Identidade', line: 'Toque de um jeito que seja seu.', detail: 'Organize técnica e referência até construir uma assinatura reconhecível.' },
];

const questions = [
  ['Preciso já saber tocar?', 'Não. O ponto de partida deve acompanhar o que você já consegue fazer e o som que quer alcançar.'],
  ['As aulas são gravadas?', 'A proposta do Studio combina biblioteca gravada e recursos adicionais conforme o plano. O conteúdo final de cada assinatura será confirmado no lançamento.'],
  ['Posso assistir pelo celular?', 'A interface está sendo projetada para celular e computador. As condições finais de acesso serão apresentadas antes da assinatura.'],
  ['Quanto tempo tenho acesso?', 'Os planos foram estruturados como assinatura mensal. As regras definitivas de acesso serão exibidas no checkout.'],
  ['Posso cancelar minha assinatura?', 'A política de cancelamento será apresentada de forma clara antes da contratação, junto das condições do plano.'],
  ['Qual a diferença entre Básico, Premium e Pro?', 'O Básico organiza o começo, o Premium amplia método e conteúdo, e o Pro acrescenta acompanhamento próximo. Veja a comparação completa nos planos.'],
  ['O plano Pro inclui aulas ao vivo?', 'Aulas ao vivo estão previstas na configuração do Pro, sujeitas à agenda e às condições publicadas no lançamento.'],
  ['O curso ensina improvisação?', 'Sim. Improvisação, fraseado, harmonia prática e identidade são o centro do Método Guitarra Agressiva™.'],
  ['Como funciona o pagamento?', 'A arquitetura está preparada para checkout recorrente com Asaas. O pagamento só será ativado quando a integração segura estiver configurada.'],
  ['Quando meu acesso é liberado?', 'Na operação final, a liberação ocorrerá após a confirmação do pagamento pelo servidor e pelo webhook do Asaas.'],
];

function External({ href, children, className = '', onClick, ...props }) {
  const handleClick = event => {
    if (href.includes('wa.me')) track('whatsapp_clicked', { href });
    onClick?.(event);
  };
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer" onClick={handleClick} {...props}>{children}</a>;
}

function Brand() {
  return <a className="brand" href="#inicio" aria-label="Studio Everaldo Filho — início"><span>EF</span><b>Studio<br />Everaldo Filho</b></a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef(null);
  useEffect(() => {
    const scroll = () => setScrolled(scrollY > 40);
    const key = event => { if (event.key === 'Escape' && open) { setOpen(false); triggerRef.current?.focus(); } };
    scroll();
    addEventListener('scroll', scroll, { passive: true });
    addEventListener('keydown', key);
    return () => { removeEventListener('scroll', scroll); removeEventListener('keydown', key); };
  }, [open]);
  const links = [['Método', 'metodo'], ['Canto', 'canto'], ['Studio', 'studio'], ['Planos', 'planos'], ['FAQ', 'duvidas']];
  return <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
    <Brand />
    <nav className="desktop-nav" aria-label="Navegação principal">{links.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
    <a className="header-action" href="#planos">Entrar no Studio <ArrowUpRight aria-hidden="true" /></a>
    <button className="menu-trigger" ref={triggerRef} onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Fechar menu' : 'Abrir menu'}>{open ? <X /> : <Menu />}</button>
    {open && <nav id="mobile-menu" className="mobile-menu" aria-label="Navegação móvel">{links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}><span>{label}</span><ArrowUpRight /></a>)}<a href="#contato" onClick={() => setOpen(false)}><span>Falar com Everaldo</span><MessageCircle /></a></nav>}
  </header>;
}

function Hero() {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();
  const [scene, setScene] = useState(0);
  const second = !reduced && scene === 1;
  return <section ref={sectionRef} id="inicio" className={`hero-scroll studio-hero ${reduced ? 'is-static' : ''}`}>
    <div className="hero">
      <div className="hero-media"><img src="/media/hero.webp" alt="Everaldo Filho segurando uma guitarra de madeira clara" width="1600" height="900" fetchPriority="high" /><ScrollPerformance sectionRef={sectionRef} reduced={reduced} onSceneChange={setScene} /></div>
      <div className="hero-scrim" />
      <div className="hero-ghost" aria-hidden="true">STUDIO</div>
      <div className="hero-copy">
        <p className="kicker"><span>STUDIO EVERALDO FILHO</span><b>TÉCNICA · IDENTIDADE · PERFORMANCE</b></p>
        <div className="hero-scenes">
          <div className={`hero-scene ${second ? 'is-hidden' : ''}`} inert={second ? true : undefined}>
            <h1>Pare de apenas tocar.<br /><em>Aprenda a dominar o instrumento.</em></h1>
            <div className="hero-lead">
              <p>Guitarra e canto com método, prática e acompanhamento para transformar técnica em expressão de verdade.</p>
              <div className="hero-actions"><a className="cta cta-signal" href="#planos" onClick={() => track('hero_cta_clicked', { target: 'pricing' })}>Quero começar agora <ArrowDown /></a><a href="#studio" onClick={() => track('hero_cta_clicked', { target: 'platform' })}>Conhecer o Studio <ArrowRight /></a></div>
              <small>Acesso pela plataforma · condições exibidas antes da assinatura</small>
            </div>
          </div>
          <div className={`hero-scene hero-scene-two ${second ? '' : 'is-hidden'}`} inert={!second ? true : undefined}>
            <h2>Técnica sem expressão<br /><em>é só movimento.</em></h2>
            <div className="hero-lead"><p>Expressão sem técnica é limitação. O Studio organiza os dois em uma jornada de evolução musical.</p><div className="hero-actions"><a className="cta cta-paper" href="#transformacao">Veja a transformação <ArrowDown /></a></div></div>
          </div>
        </div>
      </div>
      <div className="hero-rail" aria-hidden="true"><span>SCROLL TO PLAY</span><i><b /></i><strong>100 FRAMES</strong></div>
      <a className="hero-scroll-cue" href="#transformacao"><ArrowDown /><span>Entre na experiência</span></a>
    </div>
  </section>;
}

function Method() {
  const [active, setActive] = useState(0);
  const pillar = pillars[active];
  const onKey = (event, index) => {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % pillars.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + pillars.length) % pillars.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = pillars.length - 1;
    else return;
    event.preventDefault(); setActive(next); document.getElementById(`pillar-${next}`)?.focus();
  };
  return <section id="metodo" className="method section-shell">
    <div className="section-index"><span>MÉTODO AUTORAL</span><span>IMPROVISAÇÃO / EXPRESSÃO</span></div>
    <div className="method-title"><p>MÉTODO</p><h2>GUITARRA<br /><em>AGRESSIVA™</em></h2><span className="method-mark">MGA</span></div>
    <div className="method-problem"><AudioLines aria-hidden="true" /><p>Improvisação não é sorte. É repertório, técnica e intenção.</p><strong>O próximo passo é transformar recurso em linguagem.</strong></div>
    <div className="method-board">
      <div className="pillar-list" role="tablist" aria-label="Pilares do Método Guitarra Agressiva">{pillars.map((item, index) => <button id={`pillar-${index}`} key={item.title} role="tab" aria-selected={index === active} aria-controls="pillar-panel" tabIndex={index === active ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => onKey(event, index)}><span>{item.key}</span><b>{item.title}</b><ArrowRight aria-hidden="true" /></button>)}</div>
      <div id="pillar-panel" className="pillar-panel" role="tabpanel" aria-labelledby={`pillar-${active}`} tabIndex="0" key={pillar.title}>
        <span>{pillar.key} / 06</span><h3>{pillar.line}</h3><p>{pillar.detail}</p>
        <div className="fretboard" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <i key={index}><b style={{ '--position': `${13 + ((active * 19 + index * 14) % 77)}%` }} /></i>)}</div>
        <a href="#planos">Quero dominar a guitarra <ArrowUpRight /></a>
      </div>
    </div>
  </section>;
}

function ListeningRoom({ audioRef }) {
  return <section id="escuta" className="listening section-shell">
    <div className="listening-head"><div><span>APERTE O PLAY</span><h2>Antes de ensinar,<br /><em>é preciso ouvir.</em></h2></div><p>A música não é decoração nesta página. Ela é parte da experiência.</p></div>
    <PerformancePlayer audioRef={audioRef} />
  </section>;
}

function About() {
  return <section id="sobre" className="about section-shell">
    <div className="about-photo"><img src="/media/method.webp" alt="Everaldo Filho tocando guitarra" width="1300" height="731" loading="lazy" /><span>GUITARRISTA · CANTOR · PROFESSOR</span></div>
    <div className="about-copy"><span>O ARTISTA À FRENTE DO STUDIO</span><h2>Everaldo<br /><em>Filho.</em></h2><p className="about-lead">A guitarra e a voz são os pontos de partida. O Studio organiza os recursos para você se expressar através delas.</p><p>Técnica e expressão caminham juntas: entender o que você toca, ouvir melhor e dar personalidade ao que faz.</p><External href={instagram}>Ver trabalho no Instagram <Instagram /><ArrowUpRight /></External></div>
  </section>;
}

function FAQ() {
  const [open, setOpen] = useState(0);
  const toggle = index => {
    setOpen(open === index ? null : index);
    if (open !== index) track('faq_opened', { question: questions[index][0] });
  };
  return <section id="duvidas" className="faq section-shell">
    <div className="faq-head"><span>08 / OBJEÇÕES</span><h2>Dúvidas<br /><em>diretas.</em></h2><p>Se a sua pergunta não estiver aqui, <External href={wa()}>fale com Everaldo.</External></p></div>
    <div className="faq-list">{questions.map(([question, answer], index) => <article className={open === index ? 'is-open' : ''} key={question}><h3><button onClick={() => toggle(index)} aria-expanded={open === index} aria-controls={`answer-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><b>{question}</b>{open === index ? <Minus /> : <Plus />}</button></h3><div id={`answer-${index}`} hidden={open !== index}><p>{answer}</p></div></article>)}</div>
  </section>;
}

function Contact() {
  const [interest, setInterest] = useState('Studio Premium');
  const [level, setLevel] = useState('Estou começando');
  const [goal, setGoal] = useState('');
  const message = `Olá, Everaldo! Tenho interesse em ${interest}. Meu momento: ${level}.${goal.trim() ? ` Quero aprender: ${goal.trim()}.` : ''} Podemos conversar?`;
  return <section id="contato" className="contact section-shell">
    <div className="contact-head"><span>AINDA TEM UMA DÚVIDA?</span><h2>Converse com<br />quem <em>ensina.</em></h2><p>Conte onde você está. Everaldo continua a conversa com você no WhatsApp.</p></div>
    <div className="contact-panel">
      <fieldset><legend>O que você quer desenvolver?</legend><div className="interest-options">{['Studio Premium', 'Guitarra', 'Canto'].map(item => <label className={interest === item ? 'is-selected' : ''} key={item}><input type="radio" name="interest" value={item} checked={interest === item} onChange={() => setInterest(item)} /><span>{item}</span>{interest === item ? <Check /> : <Plus />}</label>)}</div></fieldset>
      <div className="contact-fields"><label htmlFor="level">Seu momento<select id="level" value={level} onChange={event => setLevel(event.target.value)}><option>Estou começando</option><option>Já tenho alguma experiência</option><option>Já toco e quero me aprofundar</option><option>Estou retomando os estudos</option></select></label><label htmlFor="goal">O que você quer tocar? <small>opcional</small><input id="goal" value={goal} onChange={event => setGoal(event.target.value)} maxLength="220" placeholder="Ex.: improvisar com mais confiança" /></label></div>
      <External className="contact-button" href={wa(message)}><MessageCircle />Abrir conversa no WhatsApp<ArrowUpRight /></External>
      <p className="contact-note">Suas escolhas já vão no texto. A mensagem só é enviada quando você confirmar no WhatsApp.</p>
    </div>
  </section>;
}

function Footer() {
  return <footer className="footer studio-footer section-shell">
    <div><Brand /><p>Técnica. Identidade.<br />Performance. Evolução.</p></div>
    <div className="footer-links"><a href="#metodo">Guitarra</a><a href="#canto">Canto</a><a href="#planos">Planos</a><a href="#studio">Plataforma</a><a href="#duvidas">FAQ</a><External href={instagram}>Instagram</External><a href="#contato">Contato</a></div>
    <div className="footer-legal"><span>Termos de Uso · em preparação</span><span>Privacidade · em preparação</span><span>Cancelamento · em preparação</span><strong><LockKeyhole /> Checkout previsto com Asaas</strong></div>
    <div className="footer-line"><span>© {new Date().getFullYear()} Studio Everaldo Filho</span><span>Trilha opcional: Sweet Child O’ Mine · cover de Jamie Morrissey</span><strong>FEITO PARA SOAR COMO VOCÊ.</strong></div>
  </footer>;
}

function MobilePlanCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => {
      const hero = document.getElementById('inicio')?.getBoundingClientRect();
      const pricing = document.getElementById('planos')?.getBoundingClientRect();
      setVisible(Boolean(hero && pricing && hero.bottom < 80 && pricing.top > innerHeight));
    };
    update();
    addEventListener('scroll', update, { passive: true });
    return () => removeEventListener('scroll', update);
  }, []);
  return <a className={`mobile-plan-cta ${visible ? 'is-visible' : ''}`} href="#planos" tabIndex={visible ? 0 : -1} aria-hidden={!visible}><span>Ver planos</span><ArrowUpRight /></a>;
}

export default function App() {
  const audioRef = useRef(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  useEffect(() => { track('visita'); }, []);
  const closeCheckout = () => setSelectedPlan(null);

  return <>
    <a className="skip-link" href="#transformacao">Pular para o conteúdo</a>
    <ScrollProgress />
    <Header />
    <main>
      <Hero />
      <TransformationStory />
      <GuitarHorizon />
      <Method />
      <SingingSection />
      <PlatformPreview />
      <ListeningRoom audioRef={audioRef} />
      <About />
      <HowItWorks />
      <ProofSection />
      <PricingSection onSelect={setSelectedPlan} />
      <Contact />
      <FAQ />
      <FinalCTA onSelect={setSelectedPlan} />
    </main>
    <Footer />
    <audio ref={audioRef} src="/media/guitar-solo.mp3" loop preload="metadata" data-audio-origin="background" />
    <MobilePlanCTA />
    <SoundControl audioRef={audioRef} />
    <CheckoutDialog plan={selectedPlan} onClose={closeCheckout} />
  </>;
}
