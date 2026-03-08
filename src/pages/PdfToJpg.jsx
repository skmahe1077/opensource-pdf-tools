import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import ProgressBar from '../components/ProgressBar';
import { pdfToJpg } from '../utils/pdfToJpg';
import { downloadBlob, downloadAsZip } from '../utils/download';

export default function PdfToJpg() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const handleFiles = (selected) => {
    setFiles(selected);
    setDone(false);
  };

  const convert = async () => {
    setProcessing(true);
    setProgress(0);
    try {
      const bytes = new Uint8Array(await files[0].arrayBuffer());
      const images = await pdfToJpg(bytes, 2.0, 0.92, setProgress);

      const baseName = files[0].name.replace('.pdf', '');
      if (images.length === 1) {
        downloadBlob(images[0].blob, `${baseName}.jpg`);
      } else {
        const namedImages = images.map((img, i) => ({ ...img, name: `${baseName}-page-${i + 1}.jpg` }));
        await downloadAsZip(namedImages, baseName);
      }
      setDone(true);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF to JPG</h1>
      <p className="text-gray-600 mb-6">Convert each PDF page to a JPG image</p>

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
              className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
            >
              {processing ? 'Converting...' : 'Convert to JPG'}
            </button>
            {done && <span className="text-green-600 font-medium py-3">Downloaded!</span>}
          </div>
        </div>
      )}
    </div>
  );
}
