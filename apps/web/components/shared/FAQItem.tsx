'use client'

import { Plus, Minus } from 'lucide-react';

export type FAQ = {
  question: string;
  answer: string;
};

type FAQCardProps = {
  faq: FAQ;
  isOpen: boolean;
  onClick: () => void;
};

export function FAQItem({ faq, isOpen, onClick }: FAQCardProps) {
  return (
    <div
      className="bg-white rounded-md p-6 shadow-sm cursor-pointer"
      onClick={onClick}
    >
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
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-gray-500 leading-relaxed text-sm pr-12">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}