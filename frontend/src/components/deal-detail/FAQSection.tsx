import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";

interface FAQSectionProps {
  deal: ComprehensiveDealDetail;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ deal }) => {
  return (
    <section id="faq-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600">
            About {deal.name}'s promo code and offer
          </p>
        </div>

        {deal.faq && deal.faq.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-3">
            {deal.faq.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border border-slate-200 rounded-lg px-6 data-[state=open]:bg-blue-50"
              >
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600 py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 pb-4 pt-2">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="bg-slate-50 rounded-lg p-8 text-center">
            <p className="text-slate-600">No FAQs available yet</p>
          </div>
        )}
      </div>
    </section>
  );
};
