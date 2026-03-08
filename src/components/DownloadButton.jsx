import { Download } from 'lucide-react';
import { downloadBlob } from '../utils/download';

export default function DownloadButton({ blob, filename, label = 'Download' }) {
  return (
    <button
      onClick={() => downloadBlob(blob, filename)}
      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
    >
      <Download className="w-5 h-5" />
      {label}
    </button>
  );
}
