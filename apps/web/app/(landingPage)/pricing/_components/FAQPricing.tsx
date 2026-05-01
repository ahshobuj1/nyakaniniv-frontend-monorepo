'use client';

import {FAQItem, type FAQ} from '@/components/shared/FAQItem';
import {useState} from 'react';

const faqsData: FAQ[] = [
  {
    question: '1. Can I change my plan later?',
    answer:
      'Yes, you can upgrade or downgrade your plan at any time from your billing settings. Changes take effect immediately.',
  },
  {
    question: '2. What currencies are supported for payments?',
    answer:
      'We support USD, EUR, GBP, and various local African currencies depending on your payment gateway. You can configure this in your dashboard.',
  },
  {
    question: '3. Is there a free trial for Pro?',
    answer:
      'Yes, we offer a 14-day free trial for the Pro plan so you can test out all the premium features before committing.',
  },
  {
    question: '4. How does the custom domain work?',
    answer:
      'You can easily connect your own custom domain (e.g., yourname.com) through your dashboard. We provide step-by-step instructions for DNS setup.',
  },
  {
    question: '5. Do you handle VAT for African countries?',
    answer:
      'Yes, our payment processor automatically calculates and handles VAT for supported African countries during the checkout process.',
  },
];

export function FAQPricing() {
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
