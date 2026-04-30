'use client';

import {useState} from 'react';
import {Plus, Minus} from 'lucide-react';

const faqs = [
  {
    question: '1. What is UpBeat Africa and how does it work?',
    answer:
      'UpBeat Africa is a platform that helps DJs create their own professional website and manage their business in one place. After signing up, a DJ can choose a subscription plan and instantly get access to a personal dashboard.',
  },
  {
    question: '2. Do I need coding skills to create my DJ website?',
    answer:
      'No, you do not need any coding skills. Our platform provides easy-to-use templates and a simple editor so you can build your website effortlessly.',
  },
  {
    question: '3. How do clients book me through the platform?',
    answer:
      'Clients can visit your custom DJ website, view your availability, and submit booking requests directly. You will receive notifications in your dashboard to approve or decline them.',
  },
  {
    question: '4. How does payment and invoicing work?',
    answer:
      'We integrate with secure payment gateways. Once a booking is confirmed, clients can pay online. The funds are routed to your connected account, and automated invoices are generated.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#F5F5F5] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-semibold text-center mb-10 text-[#111620]">
          Frequently <span className="text-primary">Asked</span> Questions
        </h2>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white rounded-md p-6 shadow-sm cursor-pointer"
                onClick={() => toggleFAQ(index)}>
                <div className="flex justify-between items-center gap-4">
                  <h3 className="text-lg font-medium text-[#111620]">
                    {faq.question}
                  </h3>
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-black/80 text-black/80">
                    {isOpen ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </div>
                </div>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100 mt-4'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}>
                  <div className="overflow-hidden">
                    <p className="text-gray-500 leading-relaxed text-sm pr-12">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
