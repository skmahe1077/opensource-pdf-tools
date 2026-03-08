import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';

export default function FileUploader({ accept, multiple = false, files, onFilesSelected, onRemove }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFilesSelected(acceptedFiles);
      }
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  });

  if (files && files.length > 0) {
    return (
      <div className="space-y-2">
        {files.map((file, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3"
          >
            <span className="text-sm text-gray-700 truncate">{file.name}</span>
            {onRemove && (
              <button
                onClick={() => onRemove(idx)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        {multiple && (
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
          >
            <input {...getInputProps()} />
            <p className="text-sm text-gray-500">+ Add more files</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400 bg-white'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <p className="text-lg font-medium text-gray-700">
        {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
      </p>
      <p className="text-sm text-gray-500 mt-1">or click to browse</p>
    </div>
  );
}
