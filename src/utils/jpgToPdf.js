import { PDFDocument } from 'pdf-lib';

export async function jpgToPdf(imageFiles) {
  const pdfDoc = await PDFDocument.create();

  for (const file of imageFiles) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let image;
    if (file.type === 'image/png') {
      image = await pdfDoc.embedPng(bytes);
    } else {
      image = await pdfDoc.embedJpg(bytes);
    }
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }
  return await pdfDoc.save();
}
