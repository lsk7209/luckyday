/**
 * FAQ Accordion 컴포넌트
 * @description 자주 묻는 질문들을 아코디언 형태로 표시
 */
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FaqItem } from '@/types/dream';

interface FAQAccordionProps {
  faqs: FaqItem[];
  className?: string;
}

export default function FAQAccordion({ faqs, className = '' }: FAQAccordionProps) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-2xl font-bold">자주 묻는 질문</h2>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
