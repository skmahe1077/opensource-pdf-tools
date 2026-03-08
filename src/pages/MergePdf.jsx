import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import ProgressBar from '../components/ProgressBar';
import DownloadButton from '../components/DownloadButton';
import { mergePdfs } from '../utils/merge';

export default function MergePdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFiles = (selected) => {
    setFiles((prev) => [...prev, ...selected]);
    setResult(null);
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const merge = async () => {
    setProcessing(true);
    try {
      const bytesArray = await Promise.all(
        files.map((f) => f.arrayBuffer().then((b) => new Uint8Array(b)))
      );
      const merged = await mergePdfs(bytesArray);
      setResult(new Blob([merged], { type: 'application/pdf' }));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Merge PDF</h1>
      <p className="text-gray-600 mb-6">Combine multiple PDF files into one</p>

      <FileUploader
        accept={{ 'application/pdf': ['.pdf'] }}
        multiple
        files={files}
        onFilesSelected={handleFiles}
        onRemove={removeFile}
      />

      {files.length >= 2 && (
        <div className="mt-6 space-y-4">
          {processing && <ProgressBar progress={null} />}
          <div className="flex gap-3">
            <button
              onClick={merge}
              disabled={processing}
              className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
            >
              {processing ? 'Merging...' : `Merge ${files.length} Files`}
            </button>
            {result && <DownloadButton blob={result} filename={files[0].name.replace('.pdf', '-merged.pdf')} />}
          </div>
        </div>
      )}
    </div>
  );
}
