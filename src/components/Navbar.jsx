import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/image/logo.png"

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [productsOpen, setProductsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Types from API
    const [types, setTypes] = useState([]);

    // Search states
    const [query, setQuery] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [searchError, setSearchError] = useState("");

    // Fetch Pokemon Types
    useEffect(() => {
        async function fetchTypes() {
            try {
                const res = await fetch("https://pokeapi.co/api/v2/type");
                const data = await res.json();
                setTypes(data.results);
            } catch (err) {
                console.error("Failed to load types:", err);
            }
        }
        fetchTypes();
    }, []);

    // Scroll effect
    useEffect(() => {
        function onScroll() {
            setScrolled(window.scrollY > 20);
        }
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // 🔎 Search function (name & type)
    async function handleSearch(e) {
        if (e.key !== "Enter") return;

        const q = query.toLowerCase().trim();
        if (!q) return;

        // Check if q is a type
        const isType = types.some(t => t.name === q);
        if (isType) {
            window.location.href = `#/type/${q}`;
            return;
        }

        // Otherwise try search by Pokémon name
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${q}`);
            if (!res.ok) {
                setSearchError("Pokemon tidak ditemukan!");
                setSearchResult(null);
                return;
            }

            const data = await res.json();
            setSearchResult(data);
            setSearchError("");
        } catch (err) {
            setSearchError("Gagal mengambil data");
            setSearchResult(null);
        }
    }

    return (
        <header
            className={`fixed w-full z-50 transition-shadow duration-300 ${scrolled ? "shadow-md bg-white/10 backdrop-blur" : "bg-transparent"
                }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <a href="#" className="flex items-center gap-3">
                            <img src={Logo} alt="" className="h-10 w-auto tracking-tight drop-shadow-[0_0_5px_yellow]" />
                            <div className="hidden sm:block">
                                <span className="text-lg text-sky-500 font-semibold tracking-tight drop-shadow-[0_0_5px_yellow]">
                                    Pokemon-API
                                </span>
                            </div>
                        </a>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex md:items-center md:space-x-6 text-sky-500">
                        <a href="#" className="text-sm font-medium hover:text-sky-600">
                            Home
                        </a>

                        {/* Dropdown Types */}
                        <div className="relative">
                            <button
                                onMouseEnter={() => setProductsOpen(true)}
                                onMouseLeave={() => setProductsOpen(false)}
                                onClick={() => setProductsOpen((s) => !s)}
                                className="flex items-center gap-2 text-sm font-medium hover:text-sky-600"
                            >
                                Types
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06-.02L10 10.67l3.71-3.48a.75.75 0 111.04 1.08l-4.25 4a.75.75 0 01-1.04 0l-4.25-4a.75.75 0 01-.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            {/* Types Dropdown */}
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
                                        {types.map((type) => (
                                            <a
                                                key={type.name}
                                                href={`#/type/${type.name}`}
                                                className="block px-3 py-2 text-sm hover:bg-gray-50 rounded capitalize"
                                            >
                                                {type.name}
                                            </a>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="hidden md:flex items-center gap-2">
                            <div className="relative">
                                <input
                                    aria-label="Search"
                                    className="w-48 px-3 py-1.5 rounded-full border text-sky-500 border-sky-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                                    placeholder="Search by name or type..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                />
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setOpen((s) => !s)}
                                aria-label="Toggle menu"
                                className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300"
                            >
                                <svg
                                    className={`w-6 h-6 transition-transform ${open ? "rotate-90" : ""}`}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    {open ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Results */}
                {searchError && (
                    <div className="absolute right-8 top-16 bg-red-500 text-white px-3 py-1 rounded">
                        {searchError}
                    </div>
                )}

                {searchResult && (
                    <div className="absolute right-8 top-16 bg-white shadow-lg p-4 rounded w-64">
                        <h3 className="text-sky-600 font-bold capitalize">
                            {searchResult.name}
                        </h3>
                        <img
                            src={searchResult.sprites.front_default}
                            alt={searchResult.name}
                            className="w-20 h-20 mx-auto"
                        />
                        <p className="text-sm mt-2">
                            Height: {searchResult.height}
                            <br />
                            Weight: {searchResult.weight}
                        </p>
                    </div>
                )}

                {/* Mobile Menu */}
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="px-2 pt-4 pb-6 space-y-3 text-sky-500">
                                <a href="#" className="block px-3 py-2 rounded-md text-base font-medium">
                                    Home
                                </a>

                                {/* Mobile Dropdown */}
                                <div>
                                    <button
                                        onClick={() => setProductsOpen((s) => !s)}
                                        className="w-full text-left px-3 py-2 rounded-md flex items-center justify-between"
                                    >
                                        <span>Types</span>
                                        <svg
                                            className={`w-4 h-4 transition-transform ${productsOpen ? "rotate-180" : ""
                                                }`}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06-.02L10 10.67l3.71-3.48a.75.75 0 111.04 1.08l-4.25 4a.75.75 0 01-1.04 0l-4.25-4a.75.75 0 01-.02-1.06z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>

                                    <AnimatePresence>
                                        {productsOpen && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="pl-4"
                                            >
                                                {types.map((type) => (
                                                    <a
                                                        key={type.name}
                                                        href={`#/type/${type.name}`}
                                                        className="block px-3 py-2 rounded-md text-sm capitalize"
                                                    >
                                                        {type.name}
                                                    </a>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
}
