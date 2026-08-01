'use client';

import { Edit, Trash2, Music, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent } from '@repo/ui';
import { MixTape } from '@repo/store';
import ReactPlayer from 'react-player';
import { useState, useRef } from 'react';

interface MixTapeCardProps {
  mixtape: MixTape;
  onEdit: () => void;
  onDelete: () => void;
}

export function MixTapeCard({ mixtape, onEdit, onDelete }: MixTapeCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [durationStr, setDurationStr] = useState('0:00');
  const [currentStr, setCurrentStr] = useState('0:00');
  const playerRef = useRef<any>(null);

  const isYouTube = mixtape.audioUrl?.includes('youtube.com') || mixtape.audioUrl?.includes('youtu.be');

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    if (playerRef.current && playerRef.current.duration) {
      playerRef.current.currentTime = (val / 100) * playerRef.current.duration;
    }
  };

  return (
    <Card className="group border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden rounded-2xl bg-white">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Image Section */}
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {mixtape.coverUrl ? (
            <img
              src={mixtape.coverUrl}
              alt={mixtape.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Music className="w-12 h-12 text-gray-300" />
          )}

          {/* Action Buttons overlay */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={onEdit}
              className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 rounded-lg shadow-sm transition-all hover:-translate-y-0.5"
              title="Edit">
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-white/90 backdrop-blur-sm hover:bg-red-50 text-red-600 rounded-lg shadow-sm transition-all hover:-translate-y-0.5"
              title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-[18px] text-[#111620] leading-tight line-clamp-1">
              {mixtape.title}
            </h3>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100 relative rounded-b-xl overflow-hidden min-h-[50px]">
            {mixtape.audioUrl ? (
              isYouTube ? (
                <div className="flex flex-col gap-2 bg-[#f1f5f9] p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (!playerRef.current) return;
                        if (isPlaying) playerRef.current.pause();
                        else playerRef.current.play();
                        setIsPlaying(!isPlaying);
                      }}
                      className="size-8 shrink-0 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-700 hover:text-black transition-colors"
                    >
                      {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
                    </button>
                    
                    <div className="flex-1 flex items-center gap-2 text-xs font-medium text-gray-500">
                      <span>{currentStr}</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={progress} 
                        onChange={handleSeek}
                        className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                      />
                      <span>{durationStr}</span>
                    </div>
                  </div>
                  
                  <ReactPlayer
                    ref={playerRef}
                    src={mixtape.audioUrl}
                    onTimeUpdate={(e: any) => {
                      const cur = e.currentTarget?.currentTime || 0;
                      const dur = e.currentTarget?.duration || 1;
                      if (dur > 0) setProgress((cur / dur) * 100);
                      setCurrentStr(formatTime(cur));
                    }}
                    onDurationChange={(e: any) => {
                      setDurationStr(formatTime(e.currentTarget?.duration || 0));
                    }}
                    onEnded={() => setIsPlaying(false)}
                    width="200px"
                    height="200px"
                    style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
                  />
                </div>
              ) : (
                <ReactPlayer
                  src={mixtape.audioUrl}
                  width="100%"
                  height="48px"
                  controls
                  className="w-full"
                  style={{ backgroundColor: '#f1f5f9' }}
                />
              )
            ) : (
              <p className="text-sm text-gray-400 italic">No audio available</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
