import { PDFDocument } from 'pdf-lib';

export async function splitPdf(pdfBytes, pageGroups) {
  const srcDoc = await PDFDocument.load(pdfBytes);
  const results = [];

  for (const indices of pageGroups) {
    const newDoc = await PDFDocument.create();
    const pages = await newDoc.copyPages(srcDoc, indices);
    pages.forEach((p) => newDoc.addPage(p));
    results.push(await newDoc.save());
  }
  return results;
}

export async function splitAllPages(pdfBytes) {
  const srcDoc = await PDFDocument.load(pdfBytes);
  const results = [];
  for (let i = 0; i < srcDoc.getPageCount(); i++) {
    const newDoc = await PDFDocument.create();
    const [page] = await newDoc.copyPages(srcDoc, [i]);
    newDoc.addPage(page);
    results.push(await newDoc.save());
  }
  return results;
}
