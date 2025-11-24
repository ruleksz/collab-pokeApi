import React, { useEffect, useState } from "react";

/**
 * PokemonDetail (Tailwind)
 * Props:
 *  - identifier: name or id
 *  - onClose: optional
 */

export default function PokemonDetail({ identifier, onClose }) {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolution, setEvolution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!identifier) return;
    let mounted = true;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
        if (!res.ok) throw new Error("Pokemon not found");
        const data = await res.json();

        const spRes = await fetch(data.species.url);
        const spData = await spRes.json();

        let evo = null;
        if (spData.evolution_chain?.url) {
          const evoRes = await fetch(spData.evolution_chain.url);
          evo = await evoRes.json();
        }

        if (mounted) {
          setPokemon(data);
          setSpecies(spData);
          setEvolution(evo);
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchAll();
    return () => (mounted = false);
  }, [identifier]);

  if (!identifier) return null;
  if (loading) return <div className="p-6 text-center text-slate-300">Loading...</div>;
  if (error) return <div className="p-6 text-red-400">Error: {error}</div>;
  if (!pokemon) return null;

  const artwork = pokemon.sprites?.other?.["official-artwork"]?.front_default || pokemon.sprites?.front_default;
  const name = pokemon.name?.[0].toUpperCase() + pokemon.name?.slice(1);
  const id = pokemon.id;
  const flavor =
    species?.flavor_text_entries?.find((e) => e.language.name === "en")?.flavor_text?.replace(/\n|\f/g, " ") ||
    "No description available.";

  function flattenEvolution(chain) {
    if (!chain) return [];
    const out = [];
    let node = chain;
    while (node) {
      out.push(node.species.name);
      node = node.evolves_to && node.evolves_to[0] ? node.evolves_to[0] : null;
    }
    return out;
  }
  const evoList = evolution ? flattenEvolution(evolution.chain) : [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-900/80 rounded-2xl p-6 shadow-lg text-slate-100">
        <div className="flex justify-end">
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-200 hover:text-white bg-slate-800/60 px-3 py-1 rounded-md transition"
              aria-label="close"
            >
              ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Left column: artwork + basic */}
          <div className="flex flex-col items-center">
            <div className="bg-slate-200/5 rounded-xl p-4 w-56 h-56 flex items-center justify-center">
              {artwork ? (
                <img
                  src={artwork}
                  alt={name}
                  className="max-h-48 object-contain"
                  onError={(e) => {
                    // fallback to uploaded local file (developer will map path to URL)
                    e.currentTarget.src = "/mnt/data/bab87814-bec1-4ed0-a754-6dcf0203f414.png";
                  }}
                />
              ) : (
                <div className="text-slate-400">No image</div>
              )}
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-sky-400">
              {name} <span className="text-slate-400 text-sm">#{id}</span>
            </h2>

            <div className="mt-3 flex gap-2 flex-wrap">
              {pokemon.types.map((t) => (
                <span
                  key={t.slot}
                  className="px-3 py-1 rounded-full bg-sky-900/40 text-sky-200 text-sm capitalize"
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>

          {/* Right columns: details */}
          <div className="md:col-span-2 space-y-4">
            <section>
              <h3 className="text-lg font-medium text-slate-100">About</h3>
              <p className="text-slate-300 mt-2">{flavor}</p>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-slate-800/60 rounded-lg p-3">
                  <div className="text-xs text-slate-400">Height</div>
                  <div className="font-semibold">{(pokemon.height * 10).toFixed(0)} cm</div>
                </div>
                <div className="bg-slate-800/60 rounded-lg p-3">
                  <div className="text-xs text-slate-400">Weight</div>
                  <div className="font-semibold">{(pokemon.weight / 10).toFixed(1)} kg</div>
                </div>
                <div className="bg-slate-800/60 rounded-lg p-3">
                  <div className="text-xs text-slate-400">Base Exp</div>
                  <div className="font-semibold">{pokemon.base_experience}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-slate-200 font-medium">Abilities</div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {pokemon.abilities.map((a) => (
                    <span key={a.ability.name} className="px-3 py-1 rounded-full bg-slate-800/50 text-slate-100 text-sm capitalize">
                      {a.ability.name}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-medium text-slate-100">Stats</h3>
              <div className="mt-3 space-y-2">
                {pokemon.stats.map((s) => {
                  const pct = Math.min(100, Math.round((s.base_stat / 255) * 100));
                  return (
                    <div key={s.stat.name} className="flex items-center gap-3">
                      <div className="w-28 text-sm text-slate-300 capitalize">{s.stat.name}</div>
                      <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                        <div className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="w-10 text-right text-sm text-slate-100">{s.base_stat}</div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-medium text-slate-100">Evolution</h3>
              <div className="mt-3 flex gap-3 items-center flex-wrap">
                {evoList.length ? (
                  evoList.map((n) => (
                    <div key={n} className="w-28 text-center">
                      <div className="mt-2 text-sm text-slate-200 capitalize">{n}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400">No evolution data</div>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-medium text-slate-100">Moves (sample)</h3>
              <div className="mt-2 flex gap-2 flex-wrap">
                {pokemon.moves.slice(0, 10).map((m) => (
                  <span key={m.move.name} className="text-sm px-3 py-1 rounded-md bg-slate-800/50 text-slate-100 capitalize">
                    {m.move.name}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
