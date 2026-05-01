'use client';

import {
  Globe,
  Calendar,
  FileText,
  Music,
  LineChart,
  Smartphone,
} from 'lucide-react';

export interface FeatureItem {
  title: string;
  description: string;
  icon: React.ElementType;
}

const featuresData: FeatureItem[] = [
  {
    title: 'Personal DJ Website',
    description:
      'Stop juggling tools. UpBeat Africa brings everything together — your website, bookings, music, and payments.',
    icon: Globe,
  },
  {
    title: 'Booking Management',
    description:
      'Handle every booking request like a pro. Confirm, negotiate, and schedule — all in one place.',
    icon: Calendar,
  },
  {
    title: 'Invoicing & Payments',
    description:
      'Auto-generate professional invoices with VAT support. Accept payments via Paystack, Flutterwave.',
    icon: FileText,
  },
  {
    title: 'Music & Mixtapes',
    description:
      'Showcase your mixes and tracks directly on your website with a built-in audio player.',
    icon: Music,
  },
  {
    title: 'Business Analytics',
    description:
      'Track earnings, profile views, and booking trends. Know your numbers, grow your business.',
    icon: LineChart,
  },
  {
    title: 'Mobile Optimised',
    description:
      'Your website and dashboard work flawlessly on every device, from phones to desktops.',
    icon: Smartphone,
  },
];

export default function Features() {
  return (
    <section className="bg-[#f0f0f0] py-24 px-6" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-[#111620] mb-4">
            One platform for your entire <br className="hidden md:block" />
            <span className="text-primary">DJ business</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-6">
            Stop juggling tools. UpBeat Africa brings everything together{' '}
            <br className="hidden md:block" />— your website, bookings, music,
            and payments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="bg-white p-10 group cursor-pointer shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-[#f0f0f0] flex items-center justify-center mb-8 transition-colors duration-300 group-hover:bg-primary/10">
                  <Icon
                    className="w-11 h-11 text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all duration-300"
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="text-xl font-semibold text-[#111620] mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-gray-500 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
