import { useRef, useEffect } from 'react';

export default function PdfPreview({ renderPage, pageNum, scale = 1, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (renderPage && canvasRef.current) {
      renderPage(pageNum, canvasRef.current, scale);
    }
  }, [renderPage, pageNum, scale]);

  return <canvas ref={canvasRef} className={`max-w-full ${className}`} />;
}
