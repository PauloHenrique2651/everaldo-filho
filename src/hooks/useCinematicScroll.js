import { useEffect, useState } from 'react';
import { useReducedMotion } from '../ScrollPerformance';

const clamp = value => Math.min(1, Math.max(0, value));

export default function useCinematicScroll(sectionRef, sceneCount) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - (section.querySelector('.transformation-stage')?.clientHeight || innerHeight));
      const progress = clamp(-rect.top / distance);
      section.style.setProperty('--story-progress', progress.toFixed(4));
      setActive(Math.min(sceneCount - 1, Math.floor(progress * sceneCount)));
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', request);
    return () => { removeEventListener('scroll', request); removeEventListener('resize', request); if (frame) cancelAnimationFrame(frame); };
  }, [reduced, sceneCount, sectionRef]);

  return { active, reduced };
}
