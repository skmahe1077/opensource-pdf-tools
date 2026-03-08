import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function editPdf(pdfBytes, annotations) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();

  for (const ann of annotations) {
    const page = pages[ann.pageIndex];
    if (!page) continue;
    const { height } = page.getSize();

    if (ann.type === 'text') {
      page.drawText(ann.text || '', {
        x: ann.x,
        y: height - ann.y - (ann.fontSize || 16),
        size: ann.fontSize || 16,
        font,
        color: rgb(
          ...(ann.color || [0, 0, 0]).map((c) => c / 255)
        ),
      });
    } else if (ann.type === 'rect') {
      page.drawRectangle({
        x: ann.x,
        y: height - ann.y - (ann.h || 50),
        width: ann.w || 100,
        height: ann.h || 50,
        borderColor: rgb(
          ...(ann.color || [0, 0, 255]).map((c) => c / 255)
        ),
        borderWidth: 2,
      });
    }
  }
  return await pdfDoc.save();
}
