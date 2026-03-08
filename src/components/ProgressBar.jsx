export default function ProgressBar({ progress }) {
  const isIndeterminate = progress === null || progress === undefined;

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      {isIndeterminate ? (
        <div className="h-full bg-blue-500 rounded-full animate-pulse w-full" />
      ) : (
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      )}
    </div>
  );
}
