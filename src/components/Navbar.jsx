import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Navbar.jsx
// Usage: import Navbar from './Navbar';
// Add <Navbar /> inside your App. This component expects Tailwind CSS to be configured in your Vite project.

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [productsOpen, setProductsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        function onScroll() {
            setScrolled(window.scrollY > 20);
        }
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`fixed w-full z-50 transition-shadow duration-300 ${scrolled ? "shadow-md bg-white/80 backdrop-blur" : "bg-transparent"
                }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left - Logo */}
                    <div className="flex items-center gap-4">
                        <a href="#" className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white font-bold">
                                K
                                n            </div>
                            <div className="hidden sm:block">
                                <span className="text-lg font-semibold tracking-tight">KingsUI</span>
                                <div className="text-xs text-gray-500 -mt-0.5">React · Vite · Tailwind</div>
                            </div>
                        </a>
                    </div>

                    {/* Center - Links (desktop) */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        <a href="#" className="text-sm font-medium hover:text-sky-600">
                            Home
                        </a>

                        <div className="relative">
                            <button
                                onMouseEnter={() => setProductsOpen(true)}
                                onMouseLeave={() => setProductsOpen(false)}
                                onClick={() => setProductsOpen((s) => !s)}
                                className="flex items-center gap-2 text-sm font-medium hover:text-sky-600 focus:outline-none"
                                aria-expanded={productsOpen}
                            >
                                Products
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06-.02L10 10.67l3.71-3.48a.75.75 0 111.04 1.08l-4.25 4a.75.75 0 01-1.04 0l-4.25-4a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                                </svg>
                            </button>

                            <AnimatePresence>
                                {productsOpen && (
                                    <motion.div
                                        onMouseEnter={() => setProductsOpen(true)}
                                        onMouseLeave={() => setProductsOpen(false)}
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        className="absolute left-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black/5 p-3"
                                    >
                                        <a href="#" className="block px-3 py-2 text-sm hover:bg-gray-50 rounded">
                                            Product A — Fast & Reliable
                                        </a>
                                        <a href="#" className="block px-3 py-2 text-sm hover:bg-gray-50 rounded">
                                            Product B — Secure
                                        </a>
                                        <a href="#" className="block px-3 py-2 text-sm hover:bg-gray-50 rounded">
                                            Product C — Scalable
                                        </a>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <a href="#" className="text-sm font-medium hover:text-sky-600">
                            Pricing
                        </a>
                        <a href="#" className="text-sm font-medium hover:text-sky-600">
                            Resources
                        </a>
                    </div>

                    {/* Right - Actions */}
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2">
                            <div className="relative">
                                <input
                                    aria-label="Search"
                                    className="w-48 px-3 py-1.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                                    placeholder="Search..."
                                />
                            </div>
                            <a href="#" className="inline-flex items-center px-4 py-2 rounded-full bg-sky-600 text-white text-sm font-medium shadow hover:brightness-95">
                                Get Started
                            </a>
                        </div>

                        {/* Profile / Avatar */}
                        <div className="hidden md:flex items-center gap-3">
                            <button className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">AH</button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setOpen((s) => !s)}
                                aria-label="Toggle menu"
                                className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300"
                            >
                                <svg className={`w-6 h-6 transition-transform ${open ? "rotate-90" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    {open ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile panel */}
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="px-2 pt-4 pb-6 space-y-3">
                                <a href="#" className="block px-3 py-2 rounded-md text-base font-medium">Home</a>
                                <div>
                                    <button
                                        onClick={() => setProductsOpen((s) => !s)}
                                        className="w-full text-left px-3 py-2 rounded-md flex items-center justify-between"
                                    >
                                        <span>Products</span>
                                        <svg className={`w-4 h-4 transition-transform ${productsOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06-.02L10 10.67l3.71-3.48a.75.75 0 111.04 1.08l-4.25 4a.75.75 0 01-1.04 0l-4.25-4a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    <AnimatePresence>
                                        {productsOpen && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pl-4">
                                                <a href="#" className="block px-3 py-2 rounded-md text-sm">Product A</a>
                                                <a href="#" className="block px-3 py-2 rounded-md text-sm">Product B</a>
                                                <a href="#" className="block px-3 py-2 rounded-md text-sm">Product C</a>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <a href="#" className="block px-3 py-2 rounded-md text-base font-medium">Pricing</a>
                                <a href="#" className="block px-3 py-2 rounded-md text-base font-medium">Resources</a>

                                <div className="pt-3 border-t border-gray-100">
                                    <a href="#" className="block px-3 py-2 rounded-md text-base font-medium">Get Started</a>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
}
