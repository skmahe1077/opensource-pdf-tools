import { PDFDocument } from 'pdf-lib';

export async function mergePdfs(pdfBytesArray) {
  const mergedPdf = await PDFDocument.create();
  for (const bytes of pdfBytesArray) {
    const donor = await PDFDocument.load(bytes);
    const pages = await mergedPdf.copyPages(donor, donor.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }
  return await mergedPdf.save();
}
