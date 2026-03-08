import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import PdfPageList from '../components/PdfPageList';
import DownloadButton from '../components/DownloadButton';
import usePdfRenderer from '../hooks/usePdfRenderer';
import { rotatePdf } from '../utils/rotate';

export default function RotatePdf() {
  const [files, setFiles] = useState([]);
  const [fileBytes, setFileBytes] = useState(null);
  const [rotations, setRotations] = useState({});
  const [result, setResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { numPages, renderPage } = usePdfRenderer(fileBytes);

  const handleFiles = async (selected) => {
    setFiles(selected);
    setResult(null);
    setRotations({});
    const bytes = await selected[0].arrayBuffer();
    setFileBytes(new Uint8Array(bytes));
  };

  const handleRotate = (pageIdx, deg) => {
    setRotations((prev) => ({
      ...prev,
      [pageIdx]: (prev[pageIdx] || 0) + deg,
    }));
  };

  const apply = async () => {
    setProcessing(true);
    try {
      const bytes = await rotatePdf(fileBytes, rotations);
      setResult(new Blob([bytes], { type: 'application/pdf' }));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Rotate PDF</h1>
      <p className="text-gray-600 mb-6">Rotate PDF pages to any angle</p>

      {!fileBytes ? (
        <FileUploader
          accept={{ 'application/pdf': ['.pdf'] }}
          files={files}
          onFilesSelected={handleFiles}
        />
      ) : (
        <div className="space-y-6">
          <PdfPageList
            renderPage={renderPage}
            numPages={numPages}
            rotations={Object.fromEntries(
              Object.entries(rotations).map(([k, v]) => [Number(k), v])
            )}
            onRotate={handleRotate}
          />
          <div className="flex gap-3">
            <button
              onClick={apply}
              disabled={processing}
              className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
            >
              {processing ? 'Processing...' : 'Apply Rotation'}
            </button>
            {result && <DownloadButton blob={result} filename={files[0].name.replace('.pdf', '-rotated.pdf')} />}
            <button
              onClick={() => { setFiles([]); setFileBytes(null); setResult(null); setRotations({}); }}
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
