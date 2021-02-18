import React from 'react';
import PdfDisplay, { Pdf } from '../PdfDisplay/PdfDisplay';

interface Props {
  questionIds: string[];
  answers: Record<string, any>;
  onChange: (value: Record<string, any>[], id?: string) => void;
}

const PdfViewer: React.FC<Props> = ({ questionIds, answers, onChange }) => {
  const pdfs: Pdf[] = [];
  questionIds.forEach((id) => {
    if (answers[id] && Array.isArray(answers[id])) {
      const imgs: Pdf[] = answers[id].map((pdf: Record<string, string>) => ({
        ...pdf,
        questionId: id,
      }));
      pdfs.push(...imgs);
    }
  });

  return <PdfDisplay pdfs={pdfs} onChange={onChange} answers={answers} />;
};

export default PdfViewer;
