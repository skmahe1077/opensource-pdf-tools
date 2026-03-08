import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import PdfPageList from '../components/PdfPageList';
import ProgressBar from '../components/ProgressBar';
import usePdfRenderer from '../hooks/usePdfRenderer';
import { splitAllPages } from '../utils/split';
import { downloadBlob } from '../utils/download';
import { downloadAsZip } from '../utils/download';

export default function SplitPdf() {
  const [files, setFiles] = useState([]);
  const [fileBytes, setFileBytes] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const { numPages, renderPage } = usePdfRenderer(fileBytes);

  const handleFiles = async (selected) => {
    setFiles(selected);
    setResult(null);
    setSelectedPages([]);
    const bytes = await selected[0].arrayBuffer();
    setFileBytes(new Uint8Array(bytes));
  };

  const togglePage = (pageNum) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum]
    );
  };

  const selectAll = () => {
    setSelectedPages(Array.from({ length: numPages }, (_, i) => i + 1));
  };

  const split = async () => {
    setProcessing(true);
    try {
      const results = await splitAllPages(fileBytes);
      const pagesToExport = selectedPages.length > 0
        ? selectedPages.sort((a, b) => a - b).map((p) => results[p - 1])
        : results;

      const blobs = pagesToExport.map((bytes, i) => ({
        blob: new Blob([bytes], { type: 'application/pdf' }),
        name: `${files[0].name.replace('.pdf', '')}-page-${selectedPages.length > 0 ? selectedPages.sort((a, b) => a - b)[i] : i + 1}.pdf`,
      }));

      if (blobs.length === 1) {
        downloadBlob(blobs[0].blob, blobs[0].name);
      } else {
        await downloadAsZip(blobs, files[0].name.replace('.pdf', '-split'));
      }
      setResult(true);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Split PDF</h1>
      <p className="text-gray-600 mb-6">Extract pages from your PDF</p>

      {!fileBytes ? (
        <FileUploader
          accept={{ 'application/pdf': ['.pdf'] }}
          files={files}
          onFilesSelected={handleFiles}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex gap-2 text-sm">
            <button onClick={selectAll} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors">
              Select All
            </button>
            <button onClick={() => setSelectedPages([])} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors">
              Deselect All
            </button>
            <span className="text-gray-500 py-1">{selectedPages.length} of {numPages} pages selected</span>
          </div>
          <PdfPageList
            renderPage={renderPage}
            numPages={numPages}
            selectedPages={selectedPages}
            onSelectPage={togglePage}
          />
          {processing && <ProgressBar progress={null} />}
          <div className="flex gap-3">
            <button
              onClick={split}
              disabled={processing}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
            >
              {processing ? 'Splitting...' : `Split ${selectedPages.length || numPages} Pages`}
            </button>
            {result && <span className="text-green-600 font-medium py-3">Downloaded!</span>}
            <button
              onClick={() => { setFiles([]); setFileBytes(null); setResult(null); setSelectedPages([]); }}
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
