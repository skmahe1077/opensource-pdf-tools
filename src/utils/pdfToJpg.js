import pdfjs from './pdfWorkerSetup';

export async function pdfToJpg(pdfBytes, scale = 2.0, quality = 0.92, onProgress) {
  const doc = await pdfjs.getDocument({ data: pdfBytes }).promise;
  const images = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = new OffscreenCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;
    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
    images.push({ blob, name: `page-${i}.jpg` });
    onProgress?.((i / doc.numPages) * 100);
  }
  return images;
}
