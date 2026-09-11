import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './ScrollPerformance';

export default function GuitarHorizon() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    if (reduced) return undefined;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return undefined;

    const mobile = matchMedia('(max-width: 700px)').matches;
    const folder = mobile ? 'guitar-frames-mobile' : 'guitar-frames';
    const cacheLimit = mobile ? 8 : 14;
    const controller = new AbortController();
    const blobs = new Map();
    const frames = new Map();
    const decoding = new Set();
    let active = false;
    let disposed = false;
    let target = 0;
    let current = 0;
    let width = 0;
    let height = 0;
    let lastDrawn = -1;
    let raf = 0;
    let lastChapter = 0;

    const schedule = () => {
      if (!raf && active && !document.hidden) raf = requestAnimationFrame(draw);
    };

    const prune = () => {
      if (frames.size <= cacheLimit) return;
      const farthest = [...frames.keys()].sort((a, b) => Math.abs(b - target) - Math.abs(a - target));
      farthest.slice(0, frames.size - cacheLimit).forEach((index) => {
        frames.get(index).close();
        frames.delete(index);
      });
    };

    async function decode(index) {
      if (disposed || frames.has(index) || decoding.has(index) || !blobs.has(index)) return;
      decoding.add(index);
      try {
        const bitmap = await createImageBitmap(blobs.get(index));
        if (disposed) bitmap.close();
        else {
          frames.set(index, bitmap);
          prune();
          schedule();
        }
      } catch {
        // The static poster remains available if a frame cannot be decoded.
      } finally {
        decoding.delete(index);
      }
    }

    function draw() {
      raf = 0;
      if (disposed || !active) return;
      current += (target - current) * 0.2;
      if (Math.abs(target - current) < 0.12) current = target;
      const wanted = Math.round(current);
      for (let offset = -3; offset <= 3; offset += 1) {
        void decode(Math.max(0, Math.min(99, Math.round(target) + offset)));
      }
      if (frames.size) {
        const closest = [...frames.keys()].reduce((a, b) => Math.abs(a - wanted) <= Math.abs(b - wanted) ? a : b);
        if (closest !== lastDrawn) {
          const frame = frames.get(closest);
          const scale = Math.max(width / frame.width, height / frame.height);
          const imageWidth = frame.width * scale;
          const imageHeight = frame.height * scale;
          context.drawImage(frame, (width - imageWidth) / 2, (height - imageHeight) / 2, imageWidth, imageHeight);
          canvas.dataset.frame = String(closest);
          canvas.style.opacity = '1';
          lastDrawn = closest;
        }
      }
      if (current !== target) schedule();
    }

    function update() {
      const bounds = section.getBoundingClientRect();
      const stage = section.querySelector('.guitar-horizon-stage');
      const distance = section.offsetHeight - stage.offsetHeight;
      const progress = Math.max(0, Math.min(1, -bounds.top / Math.max(1, distance)));
      target = progress * 99;
      section.style.setProperty('--guitar-progress', progress);
      const nextChapter = progress < 0.34 ? 0 : progress < 0.68 ? 1 : 2;
      if (nextChapter !== lastChapter) { lastChapter = nextChapter; setChapter(nextChapter); }
      active = bounds.bottom > 0 && bounds.top < innerHeight;
      schedule();
    }

    function resize() {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, mobile ? 1.35 : 1.5);
      width = Math.round(bounds.width * dpr);
      height = Math.round(bounds.height * dpr);
      canvas.width = width;
      canvas.height = height;
      lastDrawn = -1;
      update();
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    addEventListener('scroll', update, { passive: true });
    document.addEventListener('visibilitychange', update);
    resize();

    const pending = new Set(Array.from({ length: 100 }, (_, index) => index));
    async function load() {
      while (pending.size && !disposed) {
        const index = [...pending].reduce((a, b) => Math.abs(a - target) <= Math.abs(b - target) ? a : b);
        pending.delete(index);
        try {
          const response = await fetch(`/media/${folder}/frame_${String(index + 1).padStart(3, '0')}.webp`, { signal: controller.signal });
          if (!response.ok) continue;
          blobs.set(index, await response.blob());
          if (Math.abs(index - target) < 5) void decode(index);
        } catch {
          if (controller.signal.aborted) return;
        }
      }
    }
    for (let worker = 0; worker < 3; worker += 1) void load();

    return () => {
      disposed = true;
      controller.abort();
      cancelAnimationFrame(raf);
      observer.disconnect();
      removeEventListener('scroll', update);
      document.removeEventListener('visibilitychange', update);
      frames.forEach((frame) => frame.close());
    };
  }, [reduced]);

  const chapters = [
    { number: '01', label: 'OUÇA', title: <>Escute o que<br />a base está <em>pedindo.</em></> },
    { number: '02', label: 'ESCOLHA', title: <>Decida onde<br />a tensão deve <em>morar.</em></> },
    { number: '03', label: 'ASSINE', title: <>Faça cada frase<br />soar como <em>você.</em></> },
  ];
  const active = reduced ? 2 : chapter;
  return <section className={`guitar-horizon ${reduced ? 'is-static' : ''}`} ref={sectionRef} aria-label="A construção de um improviso em três decisões">
    <div className="guitar-horizon-stage">
      <img className="guitar-horizon-poster" src="/media/guitar-focus.webp" alt="Guitarra iluminada em um palco escuro" loading="lazy" />
      <canvas className="guitar-horizon-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="guitar-horizon-wash" aria-hidden="true" />
      <div className="guitar-horizon-copy">
        <p className="guitar-horizon-kicker">A CADEIA DE SINAL <span>03 DECISÕES</span></p>
        <div className="guitar-chapters">{chapters.map((item, index) => <div className={`guitar-chapter ${index === active ? 'is-active' : ''}`} key={item.number} aria-hidden={index !== active}><span>{item.number} / {item.label}</span><p className="guitar-horizon-title">{item.title}</p></div>)}</div>
        <p className="guitar-horizon-note">O método começa quando técnica deixa de ser resposta pronta e vira escolha.</p>
      </div>
      <div className="guitar-horizon-counter" aria-hidden="true"><span>INPUT</span><i /><b>OUTPUT</b></div>
    </div>
  </section>;
}
