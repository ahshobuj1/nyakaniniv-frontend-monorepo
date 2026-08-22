'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';

export default function UpcomingEvents({content}: any) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const eventsData = content?.events || {
    title: 'Events & Tours',
    subtitle: 'Catch me live at these venues and festivals.',
    list: [],
  };

  const allEvents = Array.isArray(eventsData.list) ? eventsData.list : [];

  const upcomingEvents = allEvents.filter((event: any) => !event.isPast && event.status !== 'completed');
  const pastEvents = allEvents.filter((event: any) => event.isPast || event.status === 'completed');

  const displayedEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <section id="events" className="bg-[#f4f4f4] py-8 lg:py-[100px]">
      <div className="max-w-[860px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
          className="text-center mb-[36px]">
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#111111] mb-[12px] tracking-tight">
            {eventsData.title || 'Events & Tour Dates'}
          </h2>
          <p className="text-[#888888] text-[15px] md:text-[16px]">
            {eventsData.subtitle || 'Catch me live at these venues and festivals worldwide.'}
          </p>

          {/* Upcoming / Past Filter Tabs */}
          {(pastEvents.length > 0 || allEvents.length > 0) && (
            <div className="inline-flex p-1.5 bg-white rounded-full mt-6 shadow-sm border border-gray-200/60">
              <button
                type="button"
                onClick={() => setActiveTab('upcoming')}
                className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'upcoming'
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}>
                Upcoming Events ({upcomingEvents.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('past')}
                className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'past'
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}>
                Past Events ({pastEvents.length})
              </button>
            </div>
          )}
        </motion.div>

        {/* Event List */}
        <AnimatePresence mode="wait">
          {displayedEvents.length === 0 ? (
            <motion.div
              key="empty"
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -10}}
              className="text-center py-16 bg-white rounded-2xl border border-gray-200/60 text-[#888888]">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40 text-[#111111]" />
              <p className="text-base font-semibold text-[#111111] mb-1">
                {activeTab === 'upcoming' ? 'No Upcoming Events Right Now' : 'No Past Events Found'}
              </p>
              <p className="text-sm">
                {activeTab === 'upcoming'
                  ? 'Stay tuned! New tour dates and festival appearances are announced regularly.'
                  : 'Past performances and gigs will appear here after completion.'}
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
                    transition={{duration: 0.4, delay: index * 0.05}}
                    className={`bg-white rounded-[20px] p-[20px] md:p-[24px] flex flex-col md:flex-row items-start md:items-center gap-[20px] md:gap-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all ${
                      event.isPast ? 'opacity-85' : ''
                    }`}>
                    {/* Date Box */}
                    <div className="bg-[#f4f4f4] rounded-[16px] min-w-[90px] py-3 px-2 flex flex-col items-center justify-center shrink-0 border border-gray-200/60 shadow-xs">
                      <span className="text-[26px] font-black text-[#111111] leading-none">
                        {event.day || '--'}
                      </span>
                      <span className="text-[12px] font-extrabold text-[var(--primary)] uppercase mt-[3px] tracking-wide">
                        {event.month || 'TBA'}
                      </span>
                      {event.year && (
                        <span className="text-[11px] font-semibold text-gray-500 mt-[1px]">
                          {event.year}
                        </span>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-[6px]">
                        <h3 className="text-[18px] md:text-[21px] font-bold text-[#111111]">
                          {event.title}
                        </h3>
                        {event.isPast ? (
                          <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-gray-100 text-gray-500 border border-gray-200">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200">
                            Upcoming
                          </span>
                        )}
                      </div>

                      {/* Description if available */}
                      {event.description && (
                        <p className="text-[14px] text-[#666666] mb-[12px] line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>
                      )}

                      {/* Badges / Meta Info */}
                      <div className="flex flex-wrap items-center gap-x-[18px] gap-y-[8px] text-[13px] text-[#777777]">
                        {/* Time */}
                        {event.time && (
                          <div className="flex items-center gap-[6px] text-[#111111] font-medium bg-[#f8f8f8] px-2.5 py-1 rounded-md">
                            <Clock size={14} className="text-[var(--primary)] shrink-0" />
                            <span>{event.time}</span>
                          </div>
                        )}

                        {/* Price */}
                        {priceFormatted && (
                          <div className="flex items-center gap-[6px] text-[#111111] font-medium bg-[#f8f8f8] px-2.5 py-1 rounded-md">
                            <Ticket size={14} className="text-[var(--primary)] shrink-0" />
                            <span>{priceFormatted}</span>
                          </div>
                        )}

                        {/* Venue */}
                        {event.venue && (
                          <div className="flex items-center gap-[6px]">
                            <MapPin size={14} className="text-gray-400 shrink-0" />
                            <span>{event.venue}</span>
                          </div>
                        )}

                        {/* Location */}
                        {event.location && (
                          <div className="flex items-center gap-[6px]">
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

