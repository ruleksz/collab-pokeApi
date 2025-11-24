import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PokemonDetail from "../components/PokemonDetail.jsx";

export default function HomePage() {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState(null);

    // <<< TAMBAHKAN: state untuk membuka detail (nama atau id)
    const [selectedPokemon, setSelectedPokemon] = useState(null);

    // 🔹 Ambil kategori dari URL hash (#/type/fire)
    function getTypeFromHash() {
        const hash = window.location.hash;
        if (hash.startsWith("#/type/")) {
            return hash.replace("#/type/", "");
        }
        return null;
    }

    // 🔹 Update kategori jika URL berubah
    useEffect(() => {
        function onHashChange() {
            const type = getTypeFromHash();
            setSelectedType(type);
        }
        window.addEventListener("hashchange", onHashChange);

        onHashChange(); // initial load

        return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    // ----------------------------------------------------
    // 🔹 Fetch Pokémon (all atau by type)
    // ----------------------------------------------------
    useEffect(() => {
        async function loadPokemon() {
            setLoading(true);

            try {
                // ===========================
                // CASE 1: FILTER BY TYPE
                // ===========================
                if (selectedType) {
                    const res = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
                    const data = await res.json();

                    const list = data.pokemon.slice(0, 200); // limit biar cepat

                    const details = await Promise.all(
                        list.map(async (p) => {
                            const r = await fetch(p.pokemon.url);
                            const d = await r.json();
                            return {
                                name: d.name,
                                id: d.id,
                                types: d.types.map((t) => t.type.name),
                            };
                        })
                    );

                    setPokemons(details);
                    setLoading(false);
                    return;
                }

                // ===========================
                // CASE 2: ALL POKEMON
                // ===========================
                const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=200");
                const data = await res.json();

                // Ambil detail untuk mendapatkan type
                const details = await Promise.all(
                    data.results.map(async (p) => {
                        const r = await fetch(p.url);
                        const d = await r.json();
                        return {
                            name: d.name,
                            id: d.id,
                            types: d.types.map((t) => t.type.name),
                        };
                    })
                );

                setPokemons(details);
            } catch (err) {
                console.error(err);
            }

            setLoading(false);
        }

        loadPokemon();
    }, [selectedType]);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        show: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.05 },
        }),
    };

    // <<< TAMBAHKAN: fungsi pembuka & penutup detail
    function openDetail(nameOrId) {
        setSelectedPokemon(nameOrId);
        // opsional: sync ke hash, misal: window.location.hash = `#/pokemon/${nameOrId}`;
    }

    function closeDetail() {
        setSelectedPokemon(null);
        // opsional: hapus hash atau kembalikan
    }

    return (
        <div className="pt-24 px-4 max-w-7xl mx-auto">
            {/* TITLE */}
            <h1 className="text-3xl font-bold text-sky-500 mb-6">
                {selectedType
                    ? `Kategori: ${selectedType.toUpperCase()}`
                    : "All Pokémon"}
            </h1>

            {/* LOADING */}
            {loading && (
                <div className="flex justify-center items-center mb-[580px]">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-sky-400"></div>
                    <span className="text-sky-300 ml-3 text-3xl animate-pulse">
                        Loading Pokémon...
                    </span>
                </div>
            )}

            {/* GRID LIST */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {!loading &&
                    pokemons.map((pokemon, i) => {
                        // gunakan id numeric untuk image agar konsisten
                        // NOTE: kamu bisa pakai official-artwork jika ingin gambar lebih besar:
                        // `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
                        const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

                        return (
                            <motion.div
                                key={pokemon.name}
                                custom={i}
                                initial="hidden"
                                animate="show"
                                variants={cardVariants}
                                // <<< TAMBAHKAN: klik card buka detail, tetap jaga accessibility
                                onClick={() => openDetail(pokemon.name)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") openDetail(pokemon.name);
                                }}
                                className="bg-white/70 shadow rounded-xl p-4 border border-sky-100 backdrop-blur hover:shadow-lg transition cursor-pointer hover:scale-105"
                            >
                                <img
                                    src={img}
                                    alt={pokemon.name}
                                    className="w-40 h-40 mx-auto"
                                    loading="lazy"
                                />

                                <p className="text-center mt-2 font-medium capitalize text-sky-600">
                                    {pokemon.name}
                                </p>

                                {/* 🔹 TYPE BADGES */}
                                <div className="flex justify-center gap-2 mt-2 flex-wrap">
                                    {pokemon.types.map((t) => (
                                        <span
                                            key={t}
                                            className="px-2 py-1 text-xs rounded-full bg-sky-100 text-sky-700 capitalize"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
            </div>

            {/* <<< TAMBAHKAN: Modal overlay yang memanggil PokemonDetail (sesuai komponen detail mu) */}
            {selectedPokemon && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-10">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={closeDetail}
                        aria-hidden="true"
                    />
                    <div className="relative w-full max-w-4xl mx-4">
                        <PokemonDetail identifier={selectedPokemon} onClose={closeDetail} />
                    </div>
                </div>
            )}
        </div>
    );
}
