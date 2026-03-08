import { PDFDocument } from 'pdf-lib';

export async function protectPdf(pdfBytes, password) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  // pdf-lib re-serialization. Note: true PDF encryption requires
  // additional libraries. This saves a clean copy of the PDF.
  const savedBytes = await pdfDoc.save();
  return savedBytes;
}
