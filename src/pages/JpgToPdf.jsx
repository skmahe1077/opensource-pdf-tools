import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import ProgressBar from '../components/ProgressBar';
import DownloadButton from '../components/DownloadButton';
import { jpgToPdf } from '../utils/jpgToPdf';

export default function JpgToPdf() {
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

  const convert = async () => {
    setProcessing(true);
    try {
      const pdfBytes = await jpgToPdf(files);
      setResult(new Blob([pdfBytes], { type: 'application/pdf' }));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">JPG to PDF</h1>
      <p className="text-gray-600 mb-6">Convert images to a PDF document</p>

      <FileUploader
        accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
        multiple
        files={files}
        onFilesSelected={handleFiles}
        onRemove={removeFile}
      />

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          {processing && <ProgressBar progress={null} />}
          <div className="flex gap-3">
            <button
              onClick={convert}
              disabled={processing}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
            >
              {processing ? 'Converting...' : `Convert ${files.length} Image(s) to PDF`}
            </button>
            {result && <DownloadButton blob={result} filename={files[0].name.replace(/\.\w+$/, '.pdf')} />}
          </div>
        </div>
      )}
    </div>
  );
}
