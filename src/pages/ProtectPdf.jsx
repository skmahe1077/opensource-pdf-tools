import { useState } from 'react';
import FileUploader from '../components/FileUploader';
import ProgressBar from '../components/ProgressBar';
import DownloadButton from '../components/DownloadButton';
import { protectPdf } from '../utils/protect';

export default function ProtectPdf() {
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFiles = (selected) => {
    setFiles(selected);
    setResult(null);
    setError('');
  };

  const protect = async () => {
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (!password) {
      setError('Please enter a password');
      return;
    }
    setProcessing(true);
    setError('');
    try {
      const bytes = new Uint8Array(await files[0].arrayBuffer());
      const protected_ = await protectPdf(bytes, password);
      setResult(new Blob([protected_], { type: 'application/pdf' }));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Protect PDF</h1>
      <p className="text-gray-600 mb-6">Add password protection to your PDF</p>

      <FileUploader
        accept={{ 'application/pdf': ['.pdf'] }}
        files={files}
        onFilesSelected={handleFiles}
      />

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
            Note: Client-side encryption has limitations. For sensitive documents, use professional PDF software.
          </div>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {processing && <ProgressBar progress={null} />}
          <div className="flex gap-3">
            <button
              onClick={protect}
              disabled={processing}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
            >
              {processing ? 'Protecting...' : 'Protect PDF'}
            </button>
            {result && <DownloadButton blob={result} filename={files[0].name.replace('.pdf', '-protected.pdf')} />}
          </div>
        </div>
      )}
    </div>
  );
}
