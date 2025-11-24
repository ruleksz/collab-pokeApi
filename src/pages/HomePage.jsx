import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function HomePage() {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=100");
                const detailPromises = res.data.results.map((p) => axios.get(p.url));
                const detailed = await Promise.all(detailPromises);
                setPokemon(detailed.map((d) => d.data));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-sky-600">PokeAPI Gallery</h1>

            {loading ? (
                <p className="text-gray-500 text-lg">Loading Pokémon...</p>
            ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {pokemon.map((p) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-4 rounded-2xl shadow hover:shadow-lg bg-white border border-gray-100"
                        >
                            <img
                                src={p.sprites.other["official-artwork"].front_default}
                                alt={p.name}
                                className="w-full h-32 object-contain mb-3"
                            />
                            <h2 className="text-lg font-semibold capitalize text-center">
                                {p.name}
                            </h2>
                            <div className="flex justify-center mt-2 gap-2">
                                {p.types.map((t) => (
                                    <span
                                        key={t.type.name}
                                        className="px-2 py-1 text-xs rounded-full bg-sky-100 text-sky-700"
                                    >
                                        {t.type.name}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
