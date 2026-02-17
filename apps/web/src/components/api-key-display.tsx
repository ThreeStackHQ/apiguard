"use client";

import { CheckCircle, Copy, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function ApiKeyDisplay() {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get("key") || "";
  const keyName = searchParams.get("name") || "API Key";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl w-full text-center">
      {/* Success Icon */}
      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20">
        <CheckCircle className="h-8 w-8 text-green-500" />
      </div>

      {/* Title */}
      <h2 className="text-3xl font-semibold text-white mb-3">
        API Key Created
      </h2>

      <p className="text-[#A1A1AA] mb-8">
        {keyName} has been successfully created
      </p>

      {/* API Key Display */}
      <div className="bg-[#18181B] rounded-lg border border-[#27272A] p-6 mb-6">
        <div className="flex items-center gap-3 bg-[#0F0F0F] rounded-lg p-4 mb-4">
          <code className="flex-1 text-left font-mono text-sm text-white break-all">
            {apiKey || "ag_live_xxxxxxxxxxxxxxxxxxxx"}
          </code>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-2 rounded-md bg-[#3C83F6] hover:bg-[#2563EB] text-white transition-colors"
            aria-label="Copy API key"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>

        {copied && (
          <p className="text-sm text-green-400 mb-4">
            ✓ Copied to clipboard!
          </p>
        )}

        {/* Warning Banner */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-sm font-medium text-yellow-500 mb-1">
              This key will only be shown once
            </p>
            <p className="text-xs text-yellow-500/80">
              Make sure to copy it now. You won't be able to see it again.
            </p>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center px-6 py-3 rounded-lg bg-[#3C83F6] text-white text-sm font-medium hover:bg-[#2563EB] transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
