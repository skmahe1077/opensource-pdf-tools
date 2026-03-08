import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import ProgressBar from '../components/ProgressBar';
import DownloadButton from '../components/DownloadButton';
import { compressPdf } from '../utils/compress';

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function CompressPdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [sizes, setSizes] = useState({ before: 0, after: 0 });

  const handleFiles = (selected) => {
    setFiles(selected);
    setResult(null);
  };

  const compress = async () => {
    setProcessing(true);
    try {
      const original = files[0];
      const bytes = new Uint8Array(await original.arrayBuffer());
      const compressed = await compressPdf(bytes);
      const blob = new Blob([compressed], { type: 'application/pdf' });
      setSizes({ before: original.size, after: compressed.length });
      setResult(blob);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Compress PDF</h1>
      <p className="text-gray-600 mb-6">Reduce the file size of your PDF</p>

      <FileUploader
        accept={{ 'application/pdf': ['.pdf'] }}
        files={files}
        onFilesSelected={handleFiles}
      />

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          {processing && <ProgressBar progress={null} />}
          <div className="flex gap-3 items-center">
            <button
              onClick={compress}
              disabled={processing}
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
            >
              {processing ? 'Compressing...' : 'Compress PDF'}
            </button>
            {result && <DownloadButton blob={result} filename={files[0].name.replace('.pdf', '-compressed.pdf')} />}
          </div>
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
              <p>Original: <strong>{formatSize(sizes.before)}</strong></p>
              <p>Compressed: <strong>{formatSize(sizes.after)}</strong></p>
              <p className="text-green-700 font-medium">
                Saved {((1 - sizes.after / sizes.before) * 100).toFixed(1)}%
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
