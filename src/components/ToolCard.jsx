import { Link } from 'react-router-dom';
import * as icons from 'lucide-react';

export default function ToolCard({ tool }) {
  const Icon = icons[tool.icon] || icons.FileText;

  return (
    <Link
      to={tool.path}
      className={`${tool.color} ${tool.hoverColor} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex flex-col items-center text-center gap-3`}
    >
      <Icon className="w-10 h-10" strokeWidth={1.5} />
      <h3 className="font-semibold text-lg">{tool.name}</h3>
      <p className="text-sm text-white/80">{tool.description}</p>
    </Link>
  );
}
