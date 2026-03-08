import { useState, useRef, useEffect } from 'react';
import FileUploader from '../components/FileUploader';
import SignatureCanvas from '../components/SignatureCanvas';
import DownloadButton from '../components/DownloadButton';
import usePdfRenderer from '../hooks/usePdfRenderer';
import { signPdf } from '../utils/signPdf';

export default function SignPdf() {
  const [files, setFiles] = useState([]);
  const [fileBytes, setFileBytes] = useState(null);
  const [signatureBlob, setSignatureBlob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSigPad, setShowSigPad] = useState(false);
  const [placement, setPlacement] = useState(null);
  const [result, setResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef(null);
  const { numPages, renderPage } = usePdfRenderer(fileBytes);

  const handleFiles = async (selected) => {
    setFiles(selected);
    setResult(null);
    setPlacement(null);
    setSignatureBlob(null);
    const bytes = await selected[0].arrayBuffer();
    setFileBytes(new Uint8Array(bytes));
  };

  useEffect(() => {
    if (renderPage && canvasRef.current) {
      renderPage(currentPage, canvasRef.current, 1.5);
    }
  }, [renderPage, currentPage]);

  const handleCanvasClick = (e) => {
    if (!signatureBlob) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX / 1.5;
    const y = (e.clientY - rect.top) * scaleY / 1.5;

    setPlacement({
      pageIndex: currentPage - 1,
      x,
      y,
      width: 150,
      height: 60,
    });
  };

  const apply = async () => {
    if (!signatureBlob || !placement) return;
    setProcessing(true);
    try {
      const sigBytes = new Uint8Array(await signatureBlob.arrayBuffer());
      const bytes = await signPdf(fileBytes, sigBytes, placement);
      setResult(new Blob([bytes], { type: 'application/pdf' }));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign PDF</h1>
      <p className="text-gray-600 mb-6">Draw your signature and place it on a PDF</p>

      {!fileBytes ? (
        <FileUploader
          accept={{ 'application/pdf': ['.pdf'] }}
          files={files}
          onFilesSelected={handleFiles}
        />
      ) : (
        <div className="space-y-4">
          {!signatureBlob && !showSigPad && (
            <button
              onClick={() => setShowSigPad(true)}
              className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Draw Signature
            </button>
          )}

          {showSigPad && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <SignatureCanvas
                onSave={(blob) => {
                  setSignatureBlob(blob);
                  setShowSigPad(false);
                }}
                onCancel={() => setShowSigPad(false)}
              />
            </div>
          )}

          {signatureBlob && !placement && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              Signature ready! Click on the PDF where you want to place it.
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 bg-gray-200 rounded disabled:opacity-50 text-sm"
            >
              Prev
            </button>
            <span className="text-sm">{currentPage} / {numPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
              disabled={currentPage >= numPages}
              className="px-3 py-1.5 bg-gray-200 rounded disabled:opacity-50 text-sm"
            >
              Next
            </button>
          </div>

          <div
            className="relative inline-block border border-gray-200 rounded-lg overflow-hidden cursor-crosshair"
            onClick={handleCanvasClick}
          >
            <canvas ref={canvasRef} className="max-w-full" />
            {placement && placement.pageIndex === currentPage - 1 && (
              <div
                className="absolute border-2 border-teal-500 bg-teal-500/10"
                style={{
                  left: placement.x * (canvasRef.current?.getBoundingClientRect().width / (canvasRef.current?.width / 1.5)) || 0,
                  top: placement.y * (canvasRef.current?.getBoundingClientRect().height / (canvasRef.current?.height / 1.5)) || 0,
                  width: 150,
                  height: 60,
                }}
              >
                <span className="text-xs text-teal-700 p-1">Signature</span>
              </div>
            )}
          </div>

          {placement && (
            <div className="flex gap-3">
              <button
                onClick={apply}
                disabled={processing}
                className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
              >
                {processing ? 'Signing...' : 'Apply Signature & Download'}
              </button>
              {result && <DownloadButton blob={result} filename={files[0].name.replace('.pdf', '-signed.pdf')} />}
            </div>
          )}

          <button
            onClick={() => { setFiles([]); setFileBytes(null); setResult(null); setPlacement(null); setSignatureBlob(null); }}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
