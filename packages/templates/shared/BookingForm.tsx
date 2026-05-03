'use client';

import React from 'react';
import {Calendar, Clock, User, Mail, MessageSquare} from 'lucide-react';

export default function BookingForm({themeColor}: {themeColor: string}) {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[32px] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
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
              <span>Available Weekends</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 opacity-70" />
              <span>4+ Hour Sets</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-2/3 p-10">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Event Date & Type</label>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="date" 
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all"
                />
                <select className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all appearance-none">
                  <option>Wedding</option>
                  <option>Club Night</option>
                  <option>Corporate</option>
                  <option>Private Party</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Message / Requirements</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
                <textarea 
                  placeholder="Tell me about your event..."
                  rows={4}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full text-white py-4 rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-[0.98] mt-4"
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
