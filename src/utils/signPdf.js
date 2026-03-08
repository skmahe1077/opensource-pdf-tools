import { PDFDocument } from 'pdf-lib';

export async function signPdf(pdfBytes, signatureImageBytes, placement) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const sigImage = await pdfDoc.embedPng(signatureImageBytes);
  const page = pdfDoc.getPages()[placement.pageIndex];
  const { height } = page.getSize();

  page.drawImage(sigImage, {
    x: placement.x,
    y: height - placement.y - placement.height,
    width: placement.width,
    height: placement.height,
  });
  return await pdfDoc.save();
}
