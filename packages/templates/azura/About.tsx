'use client';

import {motion} from 'framer-motion';

export default function UpcomingEvents() {
  const events = [
    {
      id: 1,
      month: 'DEC',
      day: '06',
      title: 'Global Tech Conference 2024',
      venue: 'Convention Center',
      location: 'San Francisco, USA',
    },
    {
      id: 2,
      month: 'JAN',
      day: '12',
      title: 'Winter Music Festival 2024',
      venue: 'Snow Valley Park',
      location: 'Aspen, USA',
    },
    {
      id: 3,
      month: 'FEB',
      day: '20',
      title: 'Culinary Expo 2024',
      venue: 'Downtown Plaza',
      location: 'Chicago, USA',
    },
  ];

  return (
    <section className="bg-[#fafafa] py-8 lg:py-[80px] font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-[40px]">
          <motion.h2
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            className="text-[32px] md:text-[40px] font-bold text-[#0f0f0f] mb-2 tracking-tight">
            Upcoming Events
          </motion.h2>
          <motion.p
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{delay: 0.1}}
            className="text-[16px] text-[#787878]">
            Catch me live at these venues and festivals.
          </motion.p>
        </div>

        <div className="flex flex-col gap-[16px]">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{delay: index * 0.1}}
              className="bg-[#f2f2f2] rounded-[16px] p-[24px] flex flex-col sm:flex-row items-start sm:items-center gap-[20px] sm:gap-[40px] transition-all hover:bg-[#ebebeb]">
              <div className="flex flex-col items-center justify-center min-w-[60px]">
                <span className="text-[12px] font-bold text-[var(--primary)] tracking-widest uppercase">
                  {event.month}
                </span>
                <span className="text-[32px] font-bold text-[#0f0f0f] leading-none mt-1">
                  {event.day}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="text-[20px] font-bold text-[#0f0f0f] mb-3">
                  {event.title}
                </h3>
                <div className="flex flex-wrap items-center gap-[24px] text-[14px] text-[#787878]">
                  <div className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      <path d="M2 12h20" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex text-[#787878] opacity-80">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                  <rect x="8" y="14" width="8" height="4" rx="1" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
