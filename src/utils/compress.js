import { PDFDocument } from 'pdf-lib';

export async function compressPdf(pdfBytes) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const compressedBytes = await pdfDoc.save();
  return compressedBytes;
}
