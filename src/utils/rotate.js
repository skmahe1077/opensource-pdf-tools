import { PDFDocument, degrees } from 'pdf-lib';

export async function rotatePdf(pdfBytes, rotations) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  for (const [idx, deg] of Object.entries(rotations)) {
    const page = pages[Number(idx)];
    if (page) {
      const current = page.getRotation().angle;
      page.setRotation(degrees(current + deg));
    }
  }
  return await pdfDoc.save();
}
