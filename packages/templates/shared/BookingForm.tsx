import React, { useState } from 'react';
import {Calendar, Clock, User, Mail, MessageSquare, MapPin} from 'lucide-react';
import { DatePicker, AddressAutocomplete } from '@repo/ui';

export default function BookingForm({themeColor}: {themeColor: string}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [address, setAddress] = useState('');
  const [timezone, setTimezone] = useState('EAT');

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[32px] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 font-sans">
      <div className="flex flex-col md:flex-row">
        {/* Left Side: Info */}
        <div 
          className="md:w-1/3 p-10 text-white flex flex-col justify-between"
          style={{ backgroundColor: themeColor }}
        >
          <div>
            <h2 className="text-3xl font-bold mb-4">Book the Vibe</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Ready to make your event unforgettable? Fill out the form and let's start planning the perfect set for your night.
            </p>
          </div>
          
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 opacity-70" />
              <span>Available Worldwide</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 opacity-70" />
              <span>Custom Set Durations</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-2/3 p-10">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+234 801 234 5678"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Venue Address</label>
                <AddressAutocomplete
                  value={address}
                  onChange={setAddress}
                  onSelectTimezone={setTimezone}
                  placeholder="Search venue or address..."
                  inputClassName="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm h-[48px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Event Date</label>
                <DatePicker
                  date={selectedDate}
                  onSelect={setSelectedDate}
                  minDate={new Date()}
                  placeholder="Select Date"
                  buttonClassName="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm h-[48px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Event Type</label>
                <select className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all cursor-pointer">
                  <option value="Wedding">Wedding</option>
                  <option value="Club Night">Club Night</option>
                  <option value="Corporate">Corporate Event</option>
                  <option value="Private Party">Private Party</option>
                  <option value="Concert">Concert / Festival</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Start Time</label>
                <input 
                  type="time" 
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm h-[48px] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Timezone</label>
                <select 
                  value={timezone} 
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm h-[48px] outline-none cursor-pointer"
                >
                  <option value="WAT">WAT (Nigeria)</option>
                  <option value="EAT">EAT (Kenya)</option>
                  <option value="GMT">GMT (Ghana)</option>
                  <option value="SAST">SAST (South Africa)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Duration</label>
                <select className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm h-[48px] outline-none cursor-pointer">
                  <option value="1 Hour">1 Hour</option>
                  <option value="2 Hours">2 Hours</option>
                  <option value="3 Hours">3 Hours</option>
                  <option value="4 Hours">4 Hours</option>
                  <option value="5 Hours">5 Hours</option>
                  <option value="6 Hours">6 Hours</option>
                  <option value="8 Hours">8 Hours</option>
                  <option value="10+ Hours">10+ Hours (Full Day)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Message / Requirements</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
                <textarea 
                  placeholder="Tell me about your event vibe, expected crowd, and sound requirements..."
                  rows={3}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full text-white py-4 rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-[0.98] mt-2 cursor-pointer hover:opacity-90"
              style={{ backgroundColor: themeColor }}
            >
              Send Booking Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
