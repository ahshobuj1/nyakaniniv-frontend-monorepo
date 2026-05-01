'use client';

import {FAQItem, type FAQ} from '@/components/shared/FAQItem';
import {useState} from 'react';

const faqsData: FAQ[] = [
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

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#f0f0f0] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-semibold text-center mb-10 text-[#111620]">
          Frequently <span className="text-primary">Asked</span> Questions
        </h2>

        <div className="flex flex-col gap-4">
          {faqsData.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => toggleFAQ(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
