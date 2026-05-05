'use client';

import {motion} from 'framer-motion';

export default function UpcomingEvents({content}: any) {
  // New config pattern
  const eventsData = content?.events || {
    title: 'Upcoming Events',
    subtitle: 'Catch me live at these venues and festivals.',
    list: [
      {
        id: 1,
        day: '06',
        month: 'DEC',
        title: 'Global Tech Conference 2024',
        venue: 'Convention Center',
        location: 'San Francisco, USA',
      },
      {
        id: 2,
        day: '12',
        month: 'JAN',
        title: 'Winter Music Festival 2024',
        venue: 'Snow Valley Park',
        location: 'Aspen, USA',
      },
      {
        id: 3,
        day: '20',
        month: 'FEB',
        title: 'Culinary Expo 2024',
        venue: 'Downtown Plaza',
        location: 'Chicago, USA',
      },
    ],
  };

  return (
    <section className="bg-[#f4f4f4] py-8 lg:py-[100px]">
      <div className="max-w-[800px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
          className="text-center mb-[50px]">
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#111111] mb-[12px] tracking-tight">
            {eventsData.title}
          </h2>
          <p className="text-[#888888] text-[15px] md:text-[16px]">
            {eventsData.subtitle}
          </p>
        </motion.div>

        {/* Event List */}
        <div className="flex flex-col gap-[16px]">
          {eventsData.list.map((event: any, index: number) => (
            <motion.div
              key={event.id}
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.5, delay: index * 0.1}}
              className="bg-white rounded-[16px] p-[20px] md:p-[24px] flex flex-col md:flex-row items-start md:items-center gap-[20px] md:gap-[30px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow">
              {/* Date Box */}
              <div className="bg-[#f4f4f4] rounded-[12px] min-w-[80px] h-[80px] flex flex-col items-center justify-center shrink-0">
                <span className="text-[28px] font-extrabold text-[#111111] leading-none">
                  {event.day}
                </span>
                <span className="text-[13px] font-bold text-[var(--primary)] uppercase mt-[4px]">
                  {event.month}
                </span>
              </div>

              {/* Event Details */}
              <div className="flex-1">
                <h3 className="text-[18px] md:text-[20px] font-bold text-[#111111] mb-[8px]">
                  {event.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-[20px] gap-y-[8px] text-[14px] text-[#888888]">
                  {/* Venue / Pin Icon */}
                  <div className="flex items-center gap-[6px]">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{event.venue}</span>
                  </div>

                  {/* Location / Globe Icon */}
                  <div className="flex items-center gap-[6px]">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
