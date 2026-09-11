import { useEffect, useRef, useState } from 'react';

export function useReducedMotion() {
  // Frame-by-frame canvas animation looks great on a desktop GPU, but on phones
  // it competes directly with native scrolling. Treat compact viewports as a
  // static, intentional composition instead of asking the browser to decode
  // hundreds of images while the user is swiping.
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce), (max-width: 700px)').matches || navigator.connection?.saveData === true);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce), (max-width: 700px)');
    const update = () => setReduced(query.matches || navigator.connection?.saveData === true);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}
// Bounded decode cache: compressed frames may be preloaded, but only nearby
// frames occupy decoded image memory. Native scrolling remains untouched.
export default function ScrollPerformance({ sectionRef, reduced, onSceneChange }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;
    const controller = new AbortController();
    const blobs = new Map();
    const decoded = new Map();
    const decoding = new Set();
    const mobile = matchMedia('(max-width: 700px)').matches;
    const folder = mobile ? 'frames-mobile' : 'frames';
    const limit = mobile ? 10 : 16;
    let disposed = false, raf = 0, target = 0, current = 0, lastScene = 0;
    let lastDrawn = -1, width = 0, height = 0, active = true;

    const requestTick = () => { if (!disposed && active && !raf && !document.hidden) raf = requestAnimationFrame(tick); };
    const prune = () => {
      if (decoded.size <= limit) return;
      const farthest = [...decoded.keys()].sort((a,b) => Math.abs(b-target)-Math.abs(a-target));
      for (const index of farthest.slice(0, decoded.size-limit)) { decoded.get(index).close(); decoded.delete(index); }
    };
    async function decode(index) {
      if (disposed || decoded.has(index) || decoding.has(index) || !blobs.has(index)) return;
      decoding.add(index);
      try {
        const bitmap = await createImageBitmap(blobs.get(index));
        if (disposed) { bitmap.close(); return; }
        decoded.set(index, bitmap); prune(); requestTick();
      } catch { /* The poster remains visible when a frame is unavailable. */ }
      finally { decoding.delete(index); }
    }
    function tick() {
      raf = 0;
      if (disposed || !active) return;
      current += (target-current) * .24;
      if (Math.abs(target-current)<.12) current = target;
      const wanted = Math.round(current);
      for(let offset=-3;offset<=3;offset++) { const index = Math.max(0,Math.min(99,Math.round(target)+offset)); void decode(index); }
      if (decoded.size) {
        const nearest = [...decoded.keys()].reduce((a,b) => Math.abs(a-wanted)<=Math.abs(b-wanted)?a:b);
        const bitmap = decoded.get(nearest);
        if (nearest !== lastDrawn) {
          const scale = Math.max(width/bitmap.width, height/bitmap.height);
          const w = bitmap.width*scale, h = bitmap.height*scale;
          context.drawImage(bitmap,(width-w)/2,(height-h)/2,w,h);
          canvas.style.opacity = '1';
          canvas.dataset.frame = String(nearest);
          lastDrawn = nearest;
        }
      }
      if (current !== target) requestTick();
    }
    function update() {
      const rect = section.getBoundingClientRect();
      const distance = section.offsetHeight - canvas.closest('.hero').offsetHeight;
      const progress = Math.max(0,Math.min(1,-rect.top / Math.max(1,distance)));
      target = progress * 99;
      section.style.setProperty('--scroll-progress',progress);
      const scene = progress > .52 ? 1 : 0;
      if (scene!==lastScene) { lastScene=scene; onSceneChange(scene); }
      active = rect.bottom > 0 && rect.top < innerHeight;
      requestTick();
    }
    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, mobile ? 1.4 : 1.5);
      width = Math.round(rect.width*dpr); height = Math.round(rect.height*dpr);
      canvas.width = width; canvas.height = height;
      lastDrawn = -1; update();
    }
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    addEventListener('scroll',update,{passive:true});
    document.addEventListener('visibilitychange',update);
    resize();
    const pending = new Set(Array.from({length:100},(_,i)=>i));
    async function loader() {
      while (pending.size && !disposed) {
        const index = [...pending].reduce((a,b)=>Math.abs(a-target)<=Math.abs(b-target)?a:b);
        pending.delete(index);
        try {
          const response = await fetch(`/media/${folder}/frame_${String(index+1).padStart(3,'0')}.webp`,{signal:controller.signal});
          if (!response.ok) continue;
          const blob = await response.blob();
          if (disposed) return;
          blobs.set(index,blob);
          if (Math.abs(index-target)<=4) void decode(index);
        } catch { if (controller.signal.aborted) return; }
      }
    }
    for(let i=0;i<4;i++) void loader();
    return () => {
      disposed=true; controller.abort(); cancelAnimationFrame(raf); observer.disconnect();
      removeEventListener('scroll',update); document.removeEventListener('visibilitychange',update);
      decoded.forEach(bitmap=>bitmap.close()); decoded.clear(); blobs.clear();
    };
  }, [reduced, sectionRef, onSceneChange]);
  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
