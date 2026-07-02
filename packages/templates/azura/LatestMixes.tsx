'use client';

import {useState, useRef, useEffect} from 'react';
import {motion} from 'framer-motion';
import Image from 'next/image';
import {Play, Pause, SkipBack, SkipForward, Volume2} from 'lucide-react';
import {fadeUp} from './constants';

function MixCard({img, title, genre, time, delay, onPlay, isPlaying}: any) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{y: -6}}
      transition={{delay}}
      onClick={onPlay}
      className="bg-[#fbfbfb] rounded-[16px] p-[16px] flex flex-col gap-[16px] cursor-pointer ring-1 ring-transparent transition-all hover:shadow-md">
      <div className="relative rounded-[12px] overflow-hidden aspect-[4/3] group w-full">
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <motion.div
          whileHover={{scale: 1.1}}
          className="absolute bottom-[16px] right-[16px] size-[50px] md:size-[66px] rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg">
          {isPlaying ? (
            <Pause className="size-[20px] md:size-[26px] text-white fill-white" />
          ) : (
            <Play className="size-[20px] md:size-[26px] text-white fill-white ml-[2px]" />
          )}
        </motion.div>
      </div>
      <div className="flex flex-col gap-[8px]">
        <p className={`text-[20px] font-medium leading-[26px] font-sans transition-colors ${isPlaying ? 'text-[var(--primary)]' : 'text-[#0f0f0f]'}`}>
          {title}
        </p>
        <div className="flex items-center justify-between text-[#787878] text-[14px] font-medium font-sans">
          <span>{genre}</span>
          <span>{time}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function LatestMixes({content}: any) {
  const mixes = content?.mixes || [
    {
      img: '/theme/aura/mixes-video-avator-1.png',
      title: 'Lagos Nights Vol.3',
      genre: 'Amapiano',
      time: '58:20',
      audioUrl: '',
    },
    {
      img: '/theme/aura/mixes-video-avator-2.png',
      title: 'Cape Town Grooves',
      genre: 'House',
      time: '45:15',
      audioUrl: '',
    },
    {
      img: '/theme/aura/mixes-video-avator-3.png',
      title: 'Nairobi Vibes',
      genre: 'Afrobeats',
      time: '52:30',
      audioUrl: '',
    },
  ];

  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('00:00');
  const [durationStr, setDurationStr] = useState('00:00');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeTrack = mixes[activeTrackIndex] || mixes[0];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio playback failed:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, activeTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      if (dur > 0) setProgress((current / dur) * 100);
      
      const formatTime = (time: number) => {
        if (isNaN(time)) return '00:00';
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
      };
      setCurrentTimeStr(formatTime(current));
      setDurationStr(formatTime(dur));
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTimeStr('00:00');
  };

  const togglePlay = () => {
    if (!activeTrack.audioUrl) return;
    setIsPlaying(!isPlaying);
  };

  const playMix = (index: number) => {
    if (!mixes[index].audioUrl) return;
    if (index === activeTrackIndex) {
      togglePlay();
    } else {
      setActiveTrackIndex(index);
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    if (activeTrackIndex < mixes.length - 1) {
      setActiveTrackIndex(activeTrackIndex + 1);
      setIsPlaying(true);
    }
  };

  const prevTrack = () => {
    if (activeTrackIndex > 0) {
      setActiveTrackIndex(activeTrackIndex - 1);
      setIsPlaying(true);
    }
  };

  return (
    <motion.section
      id="music"
      initial="hidden"
      whileInView="show"
      viewport={{once: true, amount: 0.15}}
      variants={{show: {transition: {staggerChildren: 0.08}}}}
      className="bg-[#f0f0f0] py-8 lg:py-[120px]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[80px] flex flex-col gap-[48px] items-center">
        
        {/* Hidden Audio Element */}
        <audio 
          ref={audioRef} 
          src={activeTrack?.audioUrl} 
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />

        <motion.div
          variants={fadeUp}
          className="text-center max-w-[585px] flex flex-col gap-[16px]">
          <h2 className="text-[#0f0f0f] font-bold text-[40px] leading-[48px]">
            Latest Mixes
          </h2>
          <p className="text-[#787878] text-[18px] leading-relaxed font-sans">
            Experience the energy. Press play to listen to recent live sets and
            curated studio mixes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] w-full">
          {mixes.map((mix: any, i: number) => (
            <MixCard
              key={i}
              img={mix.img}
              title={mix.title}
              genre={mix.genre}
              time={mix.time}
              delay={i * 0.1}
              isPlaying={isPlaying && activeTrackIndex === i}
              onPlay={() => playMix(i)}
            />
          ))}
        </div>

        {/* Now Playing Player */}
        <motion.div
          variants={fadeUp}
          className="bg-[#fbfbfb] rounded-[16px] shadow-sm p-[24px] flex flex-col md:flex-row items-center gap-[30px] w-full">
          <div className="relative size-[100px] shrink-0">
            <Image
              src={activeTrack?.img || "/theme/aura/audio.png"}
              alt="Now playing"
              fill
              className="rounded-[6px] object-cover"
            />
          </div>

          <div className="flex-1 flex flex-col gap-[10px] w-full">
            <div className="flex items-center gap-[12px]">
              <span className="bg-[var(--primary)] text-white text-[14px] px-[8px] py-[4px] rounded-[4px] font-medium font-sans">
                {isPlaying ? 'NOW PLAYING' : 'PAUSED'}
              </span>
              <span className="text-[#787878] text-[16px] font-sans">
                {activeTrack?.genre || 'Afrobeat • Live Set'}
              </span>
            </div>
            <p className="text-[#0f0f0f] text-[20px] font-semibold leading-[26px] font-sans">
              {activeTrack?.title || 'Summer Vibes Vol. 4 (Live in Accra)'}
            </p>
            <div className="flex items-center gap-[16px] pt-[8px] w-full">
              <span className="text-[#787878] text-[16px] font-sans w-12 text-right">
                {currentTimeStr}
              </span>
              <div className="flex-1 h-[8px] bg-[#ddd] rounded-[12px] overflow-hidden relative">
                <div
                  className="absolute top-0 left-0 h-full bg-[var(--primary)] rounded-[16px] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[#787878] text-[16px] font-sans w-12">
                {durationStr}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-[20px] md:pl-[31px] md:border-l border-[#c3c3c3] self-stretch pt-4 md:pt-0">
            <SkipBack 
              onClick={prevTrack}
              className={`size-[24px] cursor-pointer transition-colors ${activeTrackIndex > 0 ? 'text-[#787878] hover:text-[var(--primary)]' : 'text-[#ddd]'}`} 
            />
            <motion.button
              onClick={togglePlay}
              whileHover={{scale: 1.08}}
              whileTap={{scale: 0.95}}
              className="size-[50px] md:size-[66px] rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg">
              {isPlaying ? (
                <Pause className="size-[20px] md:size-[26px] text-white fill-white" />
              ) : (
                <Play className="size-[20px] md:size-[26px] text-white fill-white ml-[2px]" />
              )}
            </motion.button>
            <SkipForward 
              onClick={nextTrack}
              className={`size-[24px] cursor-pointer transition-colors ${activeTrackIndex < mixes.length - 1 ? 'text-[#787878] hover:text-[var(--primary)]' : 'text-[#ddd]'}`} 
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
