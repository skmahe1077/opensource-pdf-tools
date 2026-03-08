import { useState, useEffect, useCallback } from 'react';
import pdfjs from '../utils/pdfWorkerSetup';

export default function usePdfRenderer(fileBytes) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    if (!fileBytes) return;
    let cancelled = false;
    pdfjs.getDocument({ data: fileBytes }).promise.then((doc) => {
      if (!cancelled) {
        setPdfDoc(doc);
        setNumPages(doc.numPages);
      }
    });
    return () => { cancelled = true; };
  }, [fileBytes]);

  const renderPage = useCallback(
    async (pageNum, canvas, scale = 1) => {
      if (!pdfDoc) return;
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;
    },
    [pdfDoc]
  );

  return { pdfDoc, numPages, renderPage };
}
