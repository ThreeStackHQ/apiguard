"use client";

import Link from "next/link";
import { Plus, User } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  breadcrumbs: Array<{ label: string; href?: string }>;
  ctaText?: string;
  ctaHref?: string;
}

export function Header({ breadcrumbs, ctaText, ctaHref }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-[#27272A] bg-[#0F0F0F]/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-[#71717A]">/</span>}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-[#A1A1AA] hover:text-white transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white font-medium">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Right side: CTA + User menu */}
        <div className="flex items-center gap-4">
          {/* CTA Button */}
          {ctaText && ctaHref && (
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3C83F6] text-white text-sm font-medium hover:bg-[#2563EB] transition-colors"
            >
              <Plus className="h-4 w-4" />
              {ctaText}
            </Link>
          )}

          {/* User Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[#3C83F6]/10 border border-[#3C83F6]/20 hover:bg-[#3C83F6]/20 transition-colors"
              aria-label="User menu"
            >
              <User className="h-5 w-5 text-[#3C83F6]" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#18181B] border border-[#27272A] shadow-lg z-40">
                  <div className="p-2 space-y-1">
                    <Link
                      href="/dashboard/profile"
                      className="block px-3 py-2 rounded-md text-sm text-[#A1A1AA] hover:text-white hover:bg-[#27272A] transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-3 py-2 rounded-md text-sm text-[#A1A1AA] hover:text-white hover:bg-[#27272A] transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-1 border-[#27272A]" />
                    <button
                      className="w-full text-left px-3 py-2 rounded-md text-sm text-[#A1A1AA] hover:text-white hover:bg-[#27272A] transition-colors"
                      onClick={() => {
                        // TODO: Add sign out logic
                        setIsUserMenuOpen(false);
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
