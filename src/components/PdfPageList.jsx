import { useRef, useEffect } from 'react';

function PageThumbnail({ renderPage, pageNum, selected, onSelect, rotations, onRotate }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (renderPage && canvasRef.current) {
      renderPage(pageNum, canvasRef.current, 0.3);
    }
  }, [renderPage, pageNum]);

  const rotation = rotations ? rotations[pageNum - 1] || 0 : 0;

  return (
    <div
      className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
        selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect?.(pageNum)}
    >
      <div className="p-2 bg-white">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>
      <div className="text-center py-1 bg-gray-50 text-xs text-gray-600">
        Page {pageNum}
        {onRotate && (
          <div className="flex justify-center gap-1 mt-1">
            <button
              onClick={(e) => { e.stopPropagation(); onRotate(pageNum - 1, -90); }}
              className="px-1.5 py-0.5 bg-gray-200 rounded hover:bg-gray-300 text-xs"
            >
              -90
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onRotate(pageNum - 1, 90); }}
              className="px-1.5 py-0.5 bg-gray-200 rounded hover:bg-gray-300 text-xs"
            >
              +90
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PdfPageList({
  renderPage,
  numPages,
  selectedPages,
  onSelectPage,
  rotations,
  onRotate,
}) {
  if (!numPages) return null;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {Array.from({ length: numPages }, (_, i) => (
        <PageThumbnail
          key={i + 1}
          renderPage={renderPage}
          pageNum={i + 1}
          selected={selectedPages?.includes(i + 1)}
          onSelect={onSelectPage}
          rotations={rotations}
          onRotate={onRotate}
        />
      ))}
    </div>
  );
}
