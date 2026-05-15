'use client';

import React, {useState} from 'react';
import {motion} from 'framer-motion';
import Image from 'next/image';

export default function LatestMixes({content}: any) {
  const mixContent = content?.latestMixes || {
    title: 'Latest Mixtapes',
    subtitle:
      'Listen to recent live sets and studio mixes to get a taste of the sound.',
    coverImage: '/theme/kenzo/mix-steps.png',
    tracks: [
      {
        id: 1,
        title: 'Summer Sessions Vol. 4',
        genre: 'Amapiano & Deep House Mix',
        duration: '1:05:30',
        currentTime: '24:15',
        progress: 35,
      },
      {
        id: 2,
        title: 'Autumn Beats Mix',
        genre: 'Chill Vibes',
        duration: '1:20:45',
        currentTime: '00:00',
        progress: 0,
      },
      {
        id: 3,
        title: 'Winter Wonderland',
        genre: 'Ambient Mix',
        duration: '1:15:10',
        currentTime: '00:00',
        progress: 0,
      },
      {
        id: 4,
        title: 'Spring Awakening',
        genre: 'Uplifting Mix',
        duration: '1:03:55',
        currentTime: '00:00',
        progress: 0,
      },
      {
        id: 5,
        title: 'Late Night Grooves',
        genre: 'Deep House',
        duration: '1:10:30',
        currentTime: '00:00',
        progress: 0,
      },
      {
        id: 6,
        title: 'Sunset Chillout',
        genre: 'Relaxing Mix',
        duration: '1:12:40',
        currentTime: '00:00',
        progress: 0,
      },
      {
        id: 7,
        title: 'Road Trip Anthems',
        genre: 'Indie Mix',
        duration: '1:25:00',
        currentTime: '00:00',
        progress: 0,
      },
    ],
  };

  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const activeTrack = mixContent.tracks[activeTrackIndex];

  return (
    <section className="bg-[#fcfcfc] py-8 lg:py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
          className="text-center mb-[60px]">
          <h2 className="text-[36px] md:text-[42px] font-bold text-[#111111] mb-[12px] tracking-tight">
            {mixContent.title}
          </h2>
          <p className="text-[#888888] text-[16px] max-w-[600px] mx-auto">
            {mixContent.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[40px] lg:gap-[60px]">
          {/* Left Side: Active Player */}
          <motion.div
            initial={{opacity: 0, x: -30}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6, delay: 0.1}}
            className="lg:col-span-5">
            <div className="bg-[#f4f4f4] rounded-[24px] p-[24px] flex flex-col shadow-sm">
              {/* Cover Image */}
              <div className="relative w-full aspect-square rounded-[16px] overflow-hidden mb-[30px] shadow-md">
                <Image
                  src={mixContent.coverImage}
                  alt={activeTrack.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Track Info */}
              <div className="mb-[24px]">
                <h3 className="text-[20px] font-bold text-[#111111] mb-[6px]">
                  {activeTrack.title}
                </h3>
                <p className="text-[#888888] text-[14px]">
                  {activeTrack.genre}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-[24px]">
                <div className="w-full h-[4px] bg-[#e0e0e0] rounded-full overflow-hidden mb-[10px]">
                  <div
                    className="h-full bg-[var(--primary)] rounded-full"
                    style={{width: `${activeTrack.progress || 10}%`}}
                  />
                </div>
                <div className="flex justify-between items-center text-[12px] font-medium text-[#888888]">
                  <span>{activeTrack.currentTime || '00:00'}</span>
                  <span>{activeTrack.duration}</span>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-center gap-[30px]">
                <button
                  onClick={() =>
                    setActiveTrackIndex((prev) => Math.max(0, prev - 1))
                  }
                  className="text-[#888888] hover:text-[#111111] transition-colors">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <polygon points="19 20 9 12 19 4 19 20"></polygon>
                    <line x1="5" y1="19" x2="5" y2="5"></line>
                  </svg>
                </button>

                <button className="w-[56px] h-[56px] rounded-full bg-[var(--primary)] flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                </button>

                <button
                  onClick={() =>
                    setActiveTrackIndex((prev) =>
                      Math.min(mixContent.tracks.length - 1, prev + 1),
                    )
                  }
                  className="text-[#888888] hover:text-[#111111] transition-colors">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <polygon points="5 4 15 12 5 20 5 4"></polygon>
                    <line x1="19" y1="5" x2="19" y2="19"></line>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Playlist */}
          <motion.div
            initial={{opacity: 0, x: 30}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6, delay: 0.2}}
            className="lg:col-span-7 flex flex-col gap-[12px]">
            {mixContent.tracks.map((track: any, index: number) => {
              const isActive = index === activeTrackIndex;

              return (
                <div
                  key={track.id}
                  onClick={() => setActiveTrackIndex(index)}
                  style={{
                    borderColor: isActive ? 'var(--primary)' : 'transparent',
                    // Using inline opacity background trick for the active state
                    backgroundColor: isActive
                      ? 'rgba(var(--primary-rgb, 252, 56, 56), 0.05)'
                      : '#f4f4f4',
                  }}
                  className={`group flex items-center justify-between p-[16px] md:p-[20px] rounded-[16px] cursor-pointer transition-all border ${
                    isActive ? '' : 'hover:bg-[#ebebeb]'
                  }`}>
                  <div className="flex items-center gap-[16px] md:gap-[24px]">
                    {/* Play/Pause Icon Button */}
                    <div
                      style={{
                        backgroundColor: isActive
                          ? 'var(--primary)'
                          : '#e0e0e0',
                        color: isActive ? 'white' : '#888888',
                      }}
                      className="w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#d4d4d4]">
                      {isActive ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <rect x="6" y="4" width="4" height="16"></rect>
                          <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="ml-1">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      )}
                    </div>

                    {/* Track Details */}
                    <div>
                      <h4
                        style={{color: isActive ? 'var(--primary)' : '#111111'}}
                        className="text-[15px] md:text-[16px] font-bold mb-[2px] transition-colors">
                        {track.title}
                      </h4>
                      <p className="text-[13px] text-[#888888]">
                        {track.genre}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div
                    style={{color: isActive ? 'var(--primary)' : '#888888'}}
                    className="text-[13px] font-medium">
                    {track.duration}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
