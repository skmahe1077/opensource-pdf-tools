import { PDFDocument } from 'pdf-lib';

export async function unlockPdf(pdfBytes, password) {
  const pdfDoc = await PDFDocument.load(pdfBytes, {
    password,
    ignoreEncryption: true,
  });
  return await pdfDoc.save();
}
