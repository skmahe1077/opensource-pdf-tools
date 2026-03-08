import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import ProgressBar from '../components/ProgressBar';
import DownloadButton from '../components/DownloadButton';
import { wordToPdf } from '../utils/wordToPdf';

export default function WordToPdf() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFiles = (selected) => {
    setFiles(selected);
    setResult(null);
  };

  const convert = async () => {
    setProcessing(true);
    try {
      const buffer = await files[0].arrayBuffer();
      const pdfBytes = await wordToPdf(buffer);
      setResult(new Blob([pdfBytes], { type: 'application/pdf' }));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Word to PDF</h1>
      <p className="text-gray-600 mb-6">Convert DOCX documents to PDF</p>

      <FileUploader
        accept={{ 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }}
        files={files}
        onFilesSelected={handleFiles}
      />

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          {processing && <ProgressBar progress={null} />}
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
            Note: This converts text content from DOCX. Complex formatting may be simplified.
          </p>
          <div className="flex gap-3">
            <button
              onClick={convert}
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
            >
              {processing ? 'Converting...' : 'Convert to PDF'}
            </button>
            {result && <DownloadButton blob={result} filename={files[0].name.replace('.docx', '.pdf')} />}
          </div>
        </div>
      )}
    </div>
  );
}
