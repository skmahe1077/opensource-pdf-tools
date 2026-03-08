import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import ProgressBar from '../components/ProgressBar';
import DownloadButton from '../components/DownloadButton';
import { pdfToDocx } from '../utils/pdfToWord';

export default function PdfToWord() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleFiles = (selected) => {
    setFiles(selected);
    setResult(null);
  };

  const convert = async () => {
    setProcessing(true);
    setProgress(0);
    try {
      const bytes = new Uint8Array(await files[0].arrayBuffer());
      const blob = await pdfToDocx(bytes, setProgress);
      setResult(blob);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF to Word</h1>
      <p className="text-gray-600 mb-6">Convert your PDF to a Word document (.docx)</p>

      <FileUploader
        accept={{ 'application/pdf': ['.pdf'] }}
        files={files}
        onFilesSelected={handleFiles}
      />

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          {processing && <ProgressBar progress={progress} />}
          <div className="flex gap-3">
            <button
              onClick={convert}
              disabled={processing}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
            >
              {processing ? 'Converting...' : 'Convert to Word'}
            </button>
            {result && (
              <DownloadButton
                blob={result}
                filename={files[0].name.replace('.pdf', '.docx')}
                label="Download .docx"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
