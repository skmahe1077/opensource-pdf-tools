import pdfjs from './pdfWorkerSetup';
import { Document, Paragraph, TextRun, PageBreak, Packer } from 'docx';

export async function pdfToText(pdfBytes, onProgress) {
  const doc = await pdfjs.getDocument({ data: pdfBytes }).promise;
  const pages = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    pages.push(pageText);
    onProgress?.((i / doc.numPages) * 100);
  }
  return pages;
}

export async function pdfToDocx(pdfBytes, onProgress) {
  const pages = await pdfToText(pdfBytes, onProgress);

  const children = [];
  pages.forEach((pageText, idx) => {
    const lines = pageText.split(/\n+/).filter((l) => l.trim());
    lines.forEach((line) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: line, size: 24 })],
        })
      );
    });

    if (lines.length === 0) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: pageText || ' ', size: 24 })],
        })
      );
    }

    if (idx < pages.length - 1) {
      children.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );
    }
  });

  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
