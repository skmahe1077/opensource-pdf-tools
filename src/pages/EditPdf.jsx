import { useState, useRef, useEffect } from 'react';
import FileUploader from '../components/FileUploader';
import DownloadButton from '../components/DownloadButton';
import usePdfRenderer from '../hooks/usePdfRenderer';
import { editPdf } from '../utils/editPdf';

export default function EditPdf() {
  const [files, setFiles] = useState([]);
  const [fileBytes, setFileBytes] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [annotations, setAnnotations] = useState([]);
  const [mode, setMode] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [result, setResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const { numPages, renderPage } = usePdfRenderer(fileBytes);

  const handleFiles = async (selected) => {
    setFiles(selected);
    setResult(null);
    setAnnotations([]);
    const bytes = await selected[0].arrayBuffer();
    setFileBytes(new Uint8Array(bytes));
  };

  useEffect(() => {
    if (renderPage && canvasRef.current) {
      renderPage(currentPage, canvasRef.current, 1.5);
    }
  }, [renderPage, currentPage]);

  const handleCanvasClick = (e) => {
    if (mode !== 'text' || !textInput.trim()) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX / 1.5;
    const y = (e.clientY - rect.top) * scaleY / 1.5;

    setAnnotations((prev) => [
      ...prev,
      { pageIndex: currentPage - 1, type: 'text', x, y, text: textInput, fontSize, color: [0, 0, 0] },
    ]);
    setTextInput('');
  };

  const apply = async () => {
    setProcessing(true);
    try {
      const bytes = await editPdf(fileBytes, annotations);
      setResult(new Blob([bytes], { type: 'application/pdf' }));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit PDF</h1>
      <p className="text-gray-600 mb-6">Add text and annotations to your PDF</p>

      {!fileBytes ? (
        <FileUploader
          accept={{ 'application/pdf': ['.pdf'] }}
          files={files}
          onFilesSelected={handleFiles}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm"
            >
              <option value="text">Text</option>
            </select>
            {mode === 'text' && (
              <>
                <input
                  type="text"
                  placeholder="Type text, then click on PDF..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm flex-1 min-w-48"
                />
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm"
                >
                  {[10, 12, 14, 16, 20, 24, 32].map((s) => (
                    <option key={s} value={s}>{s}px</option>
                  ))}
                </select>
              </>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm">{currentPage} / {numPages}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                disabled={currentPage >= numPages}
                className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <div className="relative inline-block border border-gray-200 rounded-lg overflow-hidden cursor-crosshair" onClick={handleCanvasClick}>
            <canvas ref={canvasRef} className="max-w-full" />
          </div>

          {annotations.length > 0 && (
            <p className="text-sm text-gray-500">{annotations.length} annotation(s) added</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={apply}
              disabled={processing || annotations.length === 0}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
            >
              {processing ? 'Applying...' : 'Apply & Download'}
            </button>
            {result && <DownloadButton blob={result} filename={files[0].name.replace('.pdf', '-edited.pdf')} />}
            <button
              onClick={() => { setAnnotations([]); setResult(null); }}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Clear Annotations
            </button>
            <button
              onClick={() => { setFiles([]); setFileBytes(null); setResult(null); setAnnotations([]); }}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
