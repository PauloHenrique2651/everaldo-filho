import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, AudioLines, Check, Guitar,
  Instagram, Menu, MessageCircle, Mic2, Minus, Plus, X,
} from 'lucide-react';
import ScrollPerformance, { useReducedMotion } from './ScrollPerformance';
import GuitarHorizon from './GuitarHorizon';
import PerformancePlayer from './PerformancePlayer';
import SoundControl from './SoundControl';
import './styles.css';

const phone = '5521975769161';
const instagram = 'https://www.instagram.com/everaldofilho.gtr/';
const wa = (message = 'Olá, Everaldo! Quero saber mais sobre suas aulas de música.') => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

const pillars = [
  { key: '01', title: 'Intenção', line: 'Saiba onde cada nota quer chegar.', detail: 'Construa frases que conversam com a harmonia. Escolha notas, crie tensão e dê sentido à resolução.' },
  { key: '02', title: 'Técnica', line: 'Tenha controle do que você toca.', detail: 'Precisão, articulação e dinâmica. Bends, vibratos e palhetada entram a serviço da música.' },
  { key: '03', title: 'Confiança', line: 'Encontre caminhos fora do automático.', detail: 'Conecte ideias pelo braço e tome decisões enquanto a base acontece, sem voltar sempre ao mesmo lugar.' },
  { key: '04', title: 'Personalidade', line: 'Faça o fraseado soar como você.', detail: 'Use ritmo, silêncio, ataque e referências para desenvolver uma assinatura que seja reconhecida como sua.' },
];

const questions = [
  ['Preciso saber tocar para começar?', 'Não. O ponto de partida é definido pelo que você já consegue fazer e pelo som que quer alcançar.'],
  ['O Método Guitarra Agressiva é só velocidade?', 'Não. Técnica faz parte, mas intenção, dinâmica, fraseado, escolha de notas e personalidade são centrais.'],
  ['Já toco, mas travo para improvisar. Faz sentido?', 'Sim. O método trabalha justamente a passagem entre conhecer recursos e conseguir usá-los com confiança enquanto a música acontece.'],
  ['Também posso fazer aulas de canto?', 'Sim. Everaldo oferece aulas de canto, além de guitarra e improvisação.'],
  ['Como funcionam formato, horários e valores?', 'Esses detalhes são combinados diretamente com Everaldo pelo WhatsApp, de acordo com seu momento e disponibilidade.'],
];

function External({ href, children, className = '', ...props }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
}

function Brand() {
  return <a className="brand" href="#inicio" aria-label="Everaldo Filho — início"><span>EF</span><b>Everaldo<br />Filho</b></a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef(null);
  useEffect(() => {
    const scroll = () => setScrolled(scrollY > 40);
    const key = event => {
      if (event.key === 'Escape' && open) { setOpen(false); triggerRef.current?.focus(); }
    };
    scroll();
    addEventListener('scroll', scroll, { passive: true });
    addEventListener('keydown', key);
    return () => { removeEventListener('scroll', scroll); removeEventListener('keydown', key); };
  }, [open]);
  const links = [['Método', 'metodo'], ['Aulas', 'aulas'], ['Everaldo', 'sobre'], ['Dúvidas', 'duvidas']];
  return <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
    <Brand />
    <nav className="desktop-nav" aria-label="Navegação principal">{links.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
    <a className="header-action" href="#contato">Quero evoluir <ArrowUpRight aria-hidden="true" /></a>
    <button className="menu-trigger" ref={triggerRef} onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Fechar menu' : 'Abrir menu'}>{open ? <X /> : <Menu />}</button>
    {open && <nav id="mobile-menu" className="mobile-menu" aria-label="Navegação móvel">{links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}><span>{label}</span><ArrowUpRight /></a>)}<a href="#contato" onClick={() => setOpen(false)}><span>Começar uma conversa</span><MessageCircle /></a></nav>}
  </header>;
}

function Hero() {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();
  const [scene, setScene] = useState(0);
  const second = !reduced && scene === 1;
  return <section ref={sectionRef} id="inicio" className={`hero-scroll ${reduced ? 'is-static' : ''}`}>
    <div className="hero">
      <div className="hero-media"><img src="/media/hero.webp" alt="Everaldo Filho segurando uma guitarra de madeira clara" width="1600" height="900" fetchPriority="high" /><ScrollPerformance sectionRef={sectionRef} reduced={reduced} onSceneChange={setScene} /></div>
      <div className="hero-scrim" />
      <div className="hero-ghost" aria-hidden="true">EVERALDO</div>
      <div className="hero-copy">
        <p className="kicker"><span>EF / GUITARRA & VOZ</span><b>MÚSICA COM IDENTIDADE</b></p>
        <div className="hero-scenes">
          <div className={`hero-scene ${second ? 'is-hidden' : ''}`} inert={second ? true : undefined}>
            <h1>Improviso<br /><em>não se decora.</em></h1>
            <div className="hero-lead"><p>Você constrói. Com técnica, intenção e coragem para fazer escolhas quando a música começa.</p><a className="cta cta-signal" href="#metodo">Conheça o método <ArrowDown /></a></div>
          </div>
          <div className={`hero-scene hero-scene-two ${second ? '' : 'is-hidden'}`} inert={!second ? true : undefined}>
            <h2>Técnica para<br /><em>dizer alguma coisa.</em></h2>
            <div className="hero-lead"><p>Aprenda a improvisar com qualidade, confiança e personalidade — sem depender apenas de frases decoradas.</p><a className="cta cta-paper" href="#contato">Quero encontrar meu som <ArrowUpRight /></a></div>
          </div>
        </div>
      </div>
      <div className="hero-rail" aria-hidden="true"><span>SCROLL TO PLAY</span><i><b /></i><strong>100 FRAMES</strong></div>
      <a className="hero-scroll-cue" href="#manifesto"><ArrowDown /><span>Continue</span></a>
    </div>
  </section>;
}

function Manifesto() {
  return <section id="manifesto" className="manifesto section-shell">
    <div className="manifesto-meta"><span>O PONTO DE VIRADA</span><span>01 — 04</span></div>
    <div className="manifesto-grid"><p>Técnica abre caminhos.</p><h2>Mas só vira música<br />quando existe <em>intenção.</em></h2></div>
    <div className="manifesto-foot"><span>OUVIR</span><i /><span>ESCOLHER</span><i /><span>TOCAR</span><i /><span>ASSINAR</span></div>
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
    <div className="method-title"><p>MÉTODO</p><h2>GUITARRA<br /><em>AGRESSIVA</em></h2><span className="method-mark">MGA®</span></div>
    <div className="method-problem"><AudioLines aria-hidden="true" /><p>Você conhece escalas e alguns licks. Mas, quando chega a hora do solo, volta sempre às mesmas frases?</p><strong>O próximo passo é transformar recurso em linguagem.</strong></div>
    <div className="method-board">
      <div className="pillar-list" role="tablist" aria-label="Pilares do Método Guitarra Agressiva">{pillars.map((item, index) => <button id={`pillar-${index}`} key={item.title} role="tab" aria-selected={index === active} aria-controls="pillar-panel" tabIndex={index === active ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => onKey(event, index)}><span>{item.key}</span><b>{item.title}</b><ArrowRight aria-hidden="true" /></button>)}</div>
      <div id="pillar-panel" className="pillar-panel" role="tabpanel" aria-labelledby={`pillar-${active}`} tabIndex="0" key={pillar.title}>
        <span>{pillar.key} / 04</span><h3>{pillar.line}</h3><p>{pillar.detail}</p>
        <div className="fretboard" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <i key={index}><b style={{ '--position': `${13 + ((active * 19 + index * 14) % 77)}%` }} /></i>)}</div>
        <a href="#contato">Quero desenvolver isso <ArrowUpRight /></a>
      </div>
    </div>
  </section>;
}

function Lessons() {
  const offers = [
    { icon: Guitar, label: 'GUITARRA', note: 'Do primeiro acorde ao improviso', text: 'Construa base, técnica e liberdade no braço. O estudo acompanha seu nível e o som que você quer tocar.', tags: ['Técnica', 'Repertório', 'Improvisação'], message: 'Olá, Everaldo! Tenho interesse nas aulas de guitarra. Podemos conversar?' },
    { icon: Mic2, label: 'CANTO', note: 'Controle, presença e interpretação', text: 'Explore sua voz e desenvolva recursos para cantar com mais confiança, controle e expressão.', tags: ['Técnica vocal', 'Expressão', 'Interpretação'], message: 'Olá, Everaldo! Tenho interesse nas aulas de canto. Podemos conversar?' },
  ];
  return <section id="aulas" className="lessons section-shell">
    <div className="lessons-head"><span>DOIS CAMINHOS. A MESMA VOZ.</span><h2>O que você quer<br /><em>expressar?</em></h2></div>
    <div className="offer-list">{offers.map(({ icon: Icon, label, note, text, tags, message }, index) => <article className="offer" key={label}>
      <span className="offer-number">0{index + 1}</span><Icon className="offer-icon" strokeWidth="1.25" aria-hidden="true" />
      <div className="offer-name"><span>{note}</span><h3>{label}</h3></div>
      <div className="offer-copy"><p>{text}</p><div>{tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
      <External href={wa(message)} aria-label={`Conversar sobre aulas de ${label.toLowerCase()}`}><ArrowUpRight /></External>
    </article>)}</div>
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
    <div className="about-copy"><span>QUEM ESTÁ COM VOCÊ</span><h2>Everaldo<br /><em>Filho.</em></h2><p className="about-lead">A guitarra e a voz são os pontos de partida. O trabalho é desenvolver os recursos para você se expressar através delas.</p><p>Nas aulas e no Método Guitarra Agressiva, técnica e expressão caminham juntas: entender o que você toca, ouvir melhor e dar personalidade ao que faz.</p><External href={instagram}>Ver trabalho no Instagram <Instagram /><ArrowUpRight /></External></div>
  </section>;
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return <section id="duvidas" className="faq section-shell"><div className="faq-head"><span>SEM RUÍDO</span><h2>Dúvidas<br /><em>diretas.</em></h2><p>Se a sua pergunta não estiver aqui, <External href={wa()}>fale com Everaldo.</External></p></div><div className="faq-list">{questions.map(([question, answer], index) => <article className={open === index ? 'is-open' : ''} key={question}><h3><button onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index} aria-controls={`answer-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><b>{question}</b>{open === index ? <Minus /> : <Plus />}</button></h3><div id={`answer-${index}`} hidden={open !== index}><p>{answer}</p></div></article>)}</div></section>;
}

function Contact() {
  const [interest, setInterest] = useState('Método Guitarra Agressiva');
  const [level, setLevel] = useState('Estou começando');
  const [goal, setGoal] = useState('');
  const message = `Olá, Everaldo! Tenho interesse em ${interest}. Meu momento: ${level}.${goal.trim() ? ` Quero aprender: ${goal.trim()}.` : ''} Podemos conversar sobre as aulas, os horários e os valores?`;
  return <section id="contato" className="contact section-shell">
    <div className="contact-head"><span>PRÓXIMO PASSO</span><h2>Chega de tocar<br />no <em>automático.</em></h2><p>Conte onde você está. Everaldo continua a conversa com você no WhatsApp.</p></div>
    <div className="contact-panel"><fieldset><legend>O que você quer desenvolver?</legend><div className="interest-options">{['Método Guitarra Agressiva', 'Guitarra', 'Canto'].map(item => <label className={interest === item ? 'is-selected' : ''} key={item}><input type="radio" name="interest" value={item} checked={interest === item} onChange={() => setInterest(item)} /><span>{item}</span>{interest === item ? <Check /> : <Plus />}</label>)}</div></fieldset><div className="contact-fields"><label htmlFor="level">Seu momento<select id="level" value={level} onChange={event => setLevel(event.target.value)}><option>Estou começando</option><option>Já tenho alguma experiência</option><option>Já toco e quero me aprofundar</option><option>Estou retomando os estudos</option></select></label><label htmlFor="goal">O que você quer tocar? <small>opcional</small><input id="goal" value={goal} onChange={event => setGoal(event.target.value)} maxLength="220" placeholder="Ex.: improvisar com mais confiança" /></label></div><External className="contact-button" href={wa(message)}><MessageCircle />Abrir conversa no WhatsApp<ArrowUpRight /></External><p className="contact-note">Suas escolhas já vão no texto. A mensagem só é enviada quando você confirmar no WhatsApp.</p></div>
  </section>;
}

function Footer() {
  return <footer className="footer section-shell"><div><Brand /><p>Seu jeito de sentir.<br />Seu jeito de tocar.</p></div><div className="footer-links"><External href={instagram}>Instagram <ArrowUpRight /></External><External href={wa()}>WhatsApp <ArrowUpRight /></External><a href="#inicio">Voltar ao topo <ArrowUpRight /></a></div><div className="footer-line"><span>© {new Date().getFullYear()} Everaldo Filho</span><span>Trilha opcional: Sweet Child O’ Mine · cover de Jamie Morrissey</span><strong>FEITO PARA SOAR COMO VOCÊ.</strong></div></footer>;
}

function MobileContact() {
  return <External className="mobile-contact" href={wa()} aria-label="Falar com Everaldo no WhatsApp"><MessageCircle /><span>Falar com Everaldo</span><ArrowUpRight /></External>;
}

export default function App() {
  const audioRef = useRef(null);
  return <><a className="skip-link" href="#metodo">Pular para o conteúdo</a><Header /><main><Hero /><Manifesto /><GuitarHorizon /><Method /><Lessons /><ListeningRoom audioRef={audioRef} /><About /><FAQ /><Contact /></main><Footer /><audio ref={audioRef} src="/media/guitar-solo.mp3" loop preload="metadata" data-audio-origin="background" /><MobileContact /><SoundControl audioRef={audioRef} /></>;
}
