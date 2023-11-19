import { oneEssayType } from "@/types/types";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface IDetailAccordion {
  selectedEssay: oneEssayType;
}

export function DetailAccordion({ selectedEssay }: IDetailAccordion) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>More details...</AccordionTrigger>
        <AccordionContent className="text-justify font-times">
          <h2 className="text-lg mb-2">Main Problem</h2>
          <p className="mb-6">{selectedEssay.mainIssue}</p>
          <h2 className="text-lg mb-2">Thesis</h2>
          <p>{selectedEssay.thesis}</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
