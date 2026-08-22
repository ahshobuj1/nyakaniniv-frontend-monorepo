'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';

export default function UpcomingEvents({content}: any) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const eventsData = content?.events || {
    title: 'Upcoming Events',
    subtitle: 'Catch me live at these venues and festivals.',
    list: [],
  };
  
  const allEvents = Array.isArray(eventsData.list) ? eventsData.list : [];

  const upcomingEvents = allEvents.filter((event: any) => !event.isPast && event.status !== 'completed');
  const pastEvents = allEvents.filter((event: any) => event.isPast || event.status === 'completed');

  const displayedEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <section id="events" className="bg-[#fafafa] py-8 lg:py-[80px] font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-[36px] flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.h2
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              className="text-[32px] md:text-[40px] font-bold text-[#0f0f0f] mb-2 tracking-tight">
              {eventsData.title || 'Events & Tour Dates'}
            </motion.h2>
            <motion.p
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{delay: 0.1}}
              className="text-[16px] text-[#787878]">
              {eventsData.subtitle || 'Catch me live at these venues and festivals.'}
            </motion.p>
          </div>

          {/* Upcoming / Past Tabs */}
          {(pastEvents.length > 0 || allEvents.length > 0) && (
            <div className="inline-flex p-1.5 bg-[#f0f0f0] rounded-xl self-start md:self-auto border border-gray-200/60">
              <button
                type="button"
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'upcoming'
                    ? 'bg-white text-[#0f0f0f] shadow-sm'
                    : 'text-[#666666] hover:text-[#0f0f0f]'
                }`}>
                Upcoming ({upcomingEvents.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'past'
                    ? 'bg-white text-[#0f0f0f] shadow-sm'
                    : 'text-[#666666] hover:text-[#0f0f0f]'
                }`}>
                Past Events ({pastEvents.length})
              </button>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {displayedEvents.length === 0 ? (
            <motion.div
              key="empty"
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -10}}
              className="text-center py-16 bg-[#f4f4f4] rounded-2xl border border-gray-200/60 text-[#787878]">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40 text-[#0f0f0f]" />
              <p className="text-base font-semibold text-[#0f0f0f] mb-1">
                {activeTab === 'upcoming' ? 'No Upcoming Events Right Now' : 'No Past Events Found'}
              </p>
              <p className="text-sm">
                {activeTab === 'upcoming'
                  ? 'Stay tuned! New dates will be announced here soon.'
                  : 'Completed gigs and past performances will appear here.'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{opacity: 0, y: 15}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -15}}
              transition={{duration: 0.3}}
              className="flex flex-col gap-[16px]">
              {displayedEvents.map((event: any, index: number) => {
                const priceFormatted = event.price !== undefined && event.price !== null
                  ? (Number(event.price) > 0 ? `KES ${Number(event.price).toLocaleString()}` : 'Free Entry')
                  : null;

                return (
                  <motion.div
                    key={event.id || index}
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{delay: index * 0.05}}
                    className={`bg-[#f2f2f2] rounded-[18px] p-[22px] md:p-[26px] flex flex-col sm:flex-row items-start sm:items-center gap-[20px] sm:gap-[32px] transition-all hover:bg-[#eaeaea] ${
                      event.isPast ? 'opacity-85' : ''
                    }`}>
                    {/* Date Box */}
                    <div className="flex flex-col items-center justify-center min-w-[76px] py-2.5 px-2 bg-white rounded-xl shadow-xs shrink-0 border border-gray-200/60">
                      <span className="text-[11px] font-extrabold text-[var(--primary)] tracking-widest uppercase">
                        {event.month || 'TBA'}
                      </span>
                      <span className="text-[26px] font-black text-[#0f0f0f] leading-none my-0.5">
                        {event.day || '--'}
                      </span>
                      {event.year && (
                        <span className="text-[11px] font-semibold text-gray-500">
                          {event.year}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h3 className="text-[19px] md:text-[21px] font-bold text-[#0f0f0f]">
                          {event.title}
                        </h3>
                        {event.isPast ? (
                          <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-gray-200 text-gray-600">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-emerald-100 text-emerald-700">
                            Upcoming
                          </span>
                        )}
                      </div>

                      {/* Event Description */}
                      {event.description && (
                        <p className="text-[14px] text-[#555555] mb-[12px] line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-[20px] gap-y-[8px] text-[13px] text-[#666666]">
                        {/* Time */}
                        {event.time && (
                          <div className="flex items-center gap-[6px] text-[#0f0f0f] font-semibold bg-white/80 px-2.5 py-1 rounded-md border border-gray-200/40">
                            <Clock size={14} className="text-[var(--primary)] shrink-0" />
                            <span>{event.time}</span>
                          </div>
                        )}

                        {/* Price */}
                        {priceFormatted && (
                          <div className="flex items-center gap-[6px] text-[#0f0f0f] font-semibold bg-white/80 px-2.5 py-1 rounded-md border border-gray-200/40">
                            <Ticket size={14} className="text-[var(--primary)] shrink-0" />
                            <span>{priceFormatted}</span>
                          </div>
                        )}

                        {/* Venue */}
                        {event.venue && (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-gray-400 shrink-0" />
                            <span>{event.venue}</span>
                          </div>
                        )}

                        {/* Location */}
                        {event.location && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-400">·</span>
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

