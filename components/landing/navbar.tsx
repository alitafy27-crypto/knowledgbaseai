"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

const links = [
  { name: "Features", href: "#features" },
  { name: "How it Works", href: "#how" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/70 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}

        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg">

            <Sparkles
              size={22}
              className="text-white"
            />

          </div>

          <div>

            <h2 className="text-xl font-bold text-white">
              knowledgbaseai
            </h2>

            <p className="text-xs text-slate-400">
              Enterprise Platform
            </p>

          </div>

        </Link>

        {/* Desktop Menu */}

        <nav className="hidden items-center gap-10 lg:flex">

          {links.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="relative text-slate-300 transition hover:text-white after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-violet-500 after:transition-all hover:after:w-full"
            >
              {item.name}
            </a>
          ))}

        </nav>

        {/* Right */}

        <div className="hidden items-center gap-4 lg:flex">

          <Link
            href="/login"
            className="rounded-xl border border-white/10 px-5 py-2.5 font-medium text-slate-300 transition hover:border-violet-500 hover:text-white"
          >
            Login
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
          >
            Get Started
          </Link>

        </div>

        {/* Mobile Button */}

        <button
          onClick={() => setOpen(!open)}
          className="text-white lg:hidden"
        >
          {open ? <X size={30} /> : <Menu size={30} />}
        </button>

      </div>

      {/* Mobile Menu */}

      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="border-t border-white/10 bg-slate-950/95 backdrop-blur-xl">

          <div className="flex flex-col px-6 py-6">

            {links.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                {item.name}
              </a>
            ))}

            <div className="mt-6 flex flex-col gap-3">

              <Link
                href="/login"
                className="rounded-xl border border-white/10 py-3 text-center text-white"
              >
                Login
              </Link>

              <Link
                href="/dashboard"
                className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3 text-center font-semibold text-white"
              >
                Get Started
              </Link>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}