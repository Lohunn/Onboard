import React from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

export default function CodeBlock({ title, code }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-[9px] bg-[#18213D] border border-[#34436A] text-[#FAF4E9] overflow-hidden shadow-sm">
      <div className="px-4 py-2 bg-[#283656] border-b border-[#34436A] flex items-center justify-between text-xs font-['JetBrains_Mono']">
        <span className="flex items-center gap-1.5 text-[#AAA59D]">
          <Terminal className="w-3.5 h-3.5 text-[#C0652D]" />
          {title || 'Example Code'}
        </span>
        <button
          onClick={handleCopy}
          className="text-[11px] text-[#AAA59D] hover:text-[#FAF4E9] flex items-center gap-1 cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-[#057A55]" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <pre className="p-4 overflow-x-auto font-['JetBrains_Mono'] text-xs text-[#FAF4E9] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
