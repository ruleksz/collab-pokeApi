import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PokemonDetail from "../components/PokemonDetail.jsx";

export default function HomePage({ searchQuery }) {
    const [pokemons, setPokemons] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedPokemon, setSelectedPokemon] = useState(null);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        show: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.05 },
        }),
    };

    const openDetail = (name) => setSelectedPokemon(name);
    const closeDetail = () => setSelectedPokemon(null);

    function getTypeFromHash() {
        const hash = window.location.hash;
        return hash.startsWith("#/type/") ? hash.replace("#/type/", "") : null;
    }

    useEffect(() => {
        const onHashChange = () => setSelectedType(getTypeFromHash());
        window.addEventListener("hashchange", onHashChange);
        onHashChange();
        return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    useEffect(() => {
        async function loadPokemon() {
            setLoading(true);

            try {
                // Jika filter type dipilih
                if (selectedType) {
                    const res = await fetch(
                        `https://pokeapi.co/api/v2/type/${selectedType}`
                    );
                    const data = await res.json();

                    const list = data.pokemon.slice(0, 200);

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
                    setFiltered(details);
                    setLoading(false);
                    return;
                }

                // Jika ALL pokemon
                const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
                const data = await res.json();

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
                setFiltered(details);
            } catch (err) {
                console.error(err);
            }

            setLoading(false);
        }

        loadPokemon();
    }, [selectedType]);

    // SEARCH + TYPE FILTER
    useEffect(() => {
        let result = pokemons;
        const q = searchQuery?.toLowerCase().trim() || "";

        if (selectedType) {
            result = result.filter((p) => p.types.includes(selectedType));
        }

        if (q) {
            const byName = result.filter((p) =>
                p.name.toLowerCase().includes(q)
            );
            const byType = result.filter((p) =>
                p.types.some((t) => t.toLowerCase().includes(q))
            );
            result = [...new Set([...byName, ...byType])];
        }

        setFiltered(result);
    }, [searchQuery, pokemons, selectedType]);

    return (
        <div className="pt-24 px-4 max-w-7xl mx-auto p-96 mb-0">
            <h1 className="text-3xl font-bold text-sky-500 mb-6 tracking-tight drop-shadow-[0_0_5px_yellow]">
                {selectedType ? `Types: ${selectedType.toUpperCase()}` : "All Pokémon"}
            </h1>

            {loading && (
                <div className="flex justify-center items-center mb-[580px]">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-sky-400"></div>
                    <span className="text-sky-300 ml-3 text-3xl animate-pulse">
                        Loading Pokémon...
                    </span>
                </div>
            )}

            <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 bg-no-repeat bg-center bg-contain bg-fixed"
                style={{
                    backgroundImage: "url('/src/assets/image/logo.png')",
                }}
            >
                {!loading &&
                    filtered.map((pokemon, i) => {
                        const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

                        return (
                            <motion.div
                                key={pokemon.name}
                                custom={i}
                                initial="hidden"
                                animate="show"
                                variants={cardVariants}
                                onClick={() => openDetail(pokemon.name)}
                                className="bg-white/70 shadow rounded-xl p-8 border border-sky-100 
                                           backdrop-blur hover:shadow-lg transition cursor-pointer hover:scale-105"
                            >
                                <img
                                    src={img}
                                    alt={pokemon.name}
                                    className="w-40 h-40 mx-auto drop-shadow-[0_0_5px_yellow] animate-bounce"
                                />

                                <p className="text-center mt-2 font-medium capitalize text-sky-600">
                                    {pokemon.name}
                                </p>

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

            {selectedPokemon && (
                <div className="fixed inset-0 z-50 flex items-start justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={closeDetail}
                    />
                    <div className="relative w-full max-w-4xl mx-4">
                        <PokemonDetail
                            identifier={selectedPokemon}
                            onClose={closeDetail}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
