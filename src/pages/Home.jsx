import { tools } from '../config/tools';
import ToolCard from '../components/ToolCard';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Every Tool You Need to Work with PDFs
        </h1>
        <p className="text-lg text-gray-600">
          All processing happens in your browser. Your files never leave your device.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
