import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useReducedMotion } from './ScrollPerformance';

const formatTime = value => {
  if (!Number.isFinite(value)) return '0:00';
  const minutes = Math.floor(value / 60);
  return `${minutes}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
};

export default function PerformancePlayer({ audioRef }) {
  const shellRef = useRef(null);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    const update = () => {
      setCurrent(audio.currentTime || 0);
      setDuration(audio.duration || 0);
      setMuted(audio.muted);
    };
    const play = () => { setPlaying(true); setError(''); };
    const pause = () => setPlaying(false);
    audio.addEventListener('timeupdate', update);
    audio.addEventListener('loadedmetadata', update);
    audio.addEventListener('volumechange', update);
    audio.addEventListener('play', play);
    audio.addEventListener('pause', pause);
    update();
    return () => {
      audio.removeEventListener('timeupdate', update);
      audio.removeEventListener('loadedmetadata', update);
      audio.removeEventListener('volumechange', update);
      audio.removeEventListener('play', play);
      audio.removeEventListener('pause', pause);
    };
  }, [audioRef]);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    try { await audio.play(); }
    catch (reason) {
      if (reason.name !== 'AbortError') setError('O navegador não conseguiu iniciar a faixa. Toque novamente.');
    }
  }

  function seek(event) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = (Number(event.target.value) / 100) * duration;
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
  }

  function tilt(event) {
    if (reduced || matchMedia('(pointer: coarse)').matches) return;
    const bounds = shellRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    shellRef.current.style.setProperty('--tilt-x', `${-y * 5}deg`);
    shellRef.current.style.setProperty('--tilt-y', `${x * 7}deg`);
  }

  function resetTilt() {
    shellRef.current?.style.setProperty('--tilt-x', '0deg');
    shellRef.current?.style.setProperty('--tilt-y', '0deg');
  }

  const percent = duration ? (current / duration) * 100 : 0;
  return <div className="performance-player" ref={shellRef} onPointerMove={tilt} onPointerLeave={resetTilt}>
    <img className="player-ambient" src="/media/guitar-focus.webp" alt="" aria-hidden="true" loading="lazy" />
    <div className="player-grain" aria-hidden="true" />
    <div className="player-object">
      <div className="player-photo">
        <img src="/media/hero.webp" alt="Everaldo Filho com sua guitarra" width="1600" height="900" loading="lazy" />
        <span className="player-stamp">EF / LISTENING ROOM</span>
        <button className="player-main" onClick={toggle} aria-label={playing ? 'Pausar trilha' : 'Reproduzir trilha'}>
          {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        </button>
      </div>
      <div className="player-console">
        <div className="player-track"><span>TRILHA DE NAVEGAÇÃO</span><strong>Sweet Child O’ Mine</strong><small>Jamie Morrissey · cover</small></div>
        <div className={`player-wave ${playing ? 'is-playing' : ''}`} aria-hidden="true">
          {Array.from({ length: 42 }, (_, index) => <i key={index} style={{ '--bar': `${18 + ((index * 17) % 73)}%`, '--delay': `${-(index % 9) * 0.08}s` }} />)}
        </div>
        <div className="player-controls">
          <button onClick={toggle} aria-label={playing ? 'Pausar trilha' : 'Reproduzir trilha'}>{playing ? <Pause /> : <Play />}</button>
          <span>{formatTime(current)}</span>
          <input aria-label="Posição da trilha" type="range" min="0" max="100" step="0.1" value={percent} onChange={seek} disabled={!duration} />
          <span>{formatTime(duration)}</span>
          <button onClick={toggleMute} aria-label={muted ? 'Ativar áudio' : 'Silenciar áudio'}>{muted ? <VolumeX /> : <Volume2 />}</button>
        </div>
        {error && <p className="player-error" role="status">{error}</p>}
      </div>
    </div>
  </div>;
}
