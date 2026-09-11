import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function SoundControl({ audioRef }) {
  const [playing,setPlaying]=useState(false);
  const [error,setError]=useState('');
  const pending=useRef(false);
  useEffect(()=>{
    const audio=audioRef.current;
    const play=()=>{setPlaying(true);setError('');}, pause=()=>setPlaying(false);
    const hide=()=>{if(document.hidden)audio.pause();};
    audio.volume=.3;
    audio.addEventListener('play',play); audio.addEventListener('pause',pause);
    document.addEventListener('visibilitychange',hide);
    return ()=>{audio.pause();audio.removeEventListener('play',play);audio.removeEventListener('pause',pause);document.removeEventListener('visibilitychange',hide);};
  },[audioRef]);
  async function toggle(){
    if(pending.current)return;
    const audio=audioRef.current;
    if(!audio.paused){audio.pause();return;}
    pending.current=true;setError('');
    try { await audio.play(); } catch (error) { if(error.name !== 'AbortError') setError('Não foi possível tocar o áudio. Tente novamente.'); }
    finally {pending.current=false;}
  }
  return <div className="sound-control"><button onClick={toggle} aria-pressed={playing} aria-label={playing?'Desativar som de fundo':'Ativar som de fundo'}>{playing?<Volume2 size={15}/>:<VolumeX size={15}/>}<span>{playing?'Som ligado':'Ativar som'}</span><span className={`equalizer ${playing?'playing':''}`} aria-hidden="true"><i/><i/><i/><i/></span></button>{error&&<p className="sound-error" role="status">{error}</p>}</div>;
}
