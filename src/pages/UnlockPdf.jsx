import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import ProgressBar from '../components/ProgressBar';
import DownloadButton from '../components/DownloadButton';
import { unlockPdf } from '../utils/unlock';

export default function UnlockPdf() {
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFiles = (selected) => {
    setFiles(selected);
    setResult(null);
    setError('');
  };

  const unlock = async () => {
    setProcessing(true);
    setError('');
    try {
      const bytes = new Uint8Array(await files[0].arrayBuffer());
      const unlocked = await unlockPdf(bytes, password);
      setResult(new Blob([unlocked], { type: 'application/pdf' }));
    } catch (e) {
      setError('Failed to unlock PDF. Check the password and try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Unlock PDF</h1>
      <p className="text-gray-600 mb-6">Remove password protection from a PDF</p>

      <FileUploader
        accept={{ 'application/pdf': ['.pdf'] }}
        files={files}
        onFilesSelected={handleFiles}
      />

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <input
            type="password"
            placeholder="Enter PDF password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {processing && <ProgressBar progress={null} />}
          <div className="flex gap-3">
            <button
              onClick={unlock}
              disabled={processing}
              className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
            >
              {processing ? 'Unlocking...' : 'Unlock PDF'}
            </button>
            {result && <DownloadButton blob={result} filename={files[0].name.replace('.pdf', '-unlocked.pdf')} />}
          </div>
        </div>
      )}
    </div>
  );
}
