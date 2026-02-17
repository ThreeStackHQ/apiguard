"use client";

import { Header } from "@/components/header";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateApiKeyPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [rateLimit, setRateLimit] = useState("100");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          rateLimit: parseInt(rateLimit),
          description: description || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create API key");
      }

      const data = await response.json();
      // Redirect to success page with the key
      router.push(`/dashboard/keys/success?key=${encodeURIComponent(data.key)}&name=${encodeURIComponent(name)}`);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "API Keys", href: "/dashboard" },
          { label: "New" },
        ]}
      />

      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-[#18181B] rounded-lg border border-[#27272A] p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Create API Key</h2>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Production API Key"
                required
                className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#27272A] text-white placeholder-[#71717A] focus:outline-none focus:ring-2 focus:ring-[#3C83F6]/50 focus:border-[#3C83F6]"
              />
            </div>

            {/* Rate Limit Dropdown */}
            <div className="mb-6">
              <label htmlFor="rateLimit" className="block text-sm font-medium text-white mb-2">
                Rate Limit <span className="text-red-400">*</span>
              </label>
              <select
                id="rateLimit"
                value={rateLimit}
                onChange={(e) => setRateLimit(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#27272A] text-white focus:outline-none focus:ring-2 focus:ring-[#3C83F6]/50 focus:border-[#3C83F6]"
              >
                <option value="100">100 requests/hour</option>
                <option value="1000">1,000 requests/hour</option>
                <option value="-1">Unlimited</option>
              </select>
            </div>

            {/* Description Textarea */}
            <div className="mb-8">
              <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                Description <span className="text-[#71717A]">(optional)</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description for this API key"
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#27272A] text-white placeholder-[#71717A] focus:outline-none focus:ring-2 focus:ring-[#3C83F6]/50 focus:border-[#3C83F6]"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#A1A1AA] hover:text-white hover:bg-[#27272A] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 rounded-lg bg-[#3C83F6] text-white text-sm font-medium hover:bg-[#2563EB] transition-colors disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
