"use client";
import Navbar from "@/components/Navbar";
import axios, { AxiosResponse } from "axios";
import { Layers3 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";



interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokemonDetails {
  id: number;
  name: string;
  types: PokemonType[];
  sprites: {
    front_default: string;
  };
}

const TYPE_COLORS: { [key: string]: string } = {
  bug: "#B1C12E",
  dark: "#4F3A2D",
  dragon: "#755EDF",
  electric: "#FCBC17",
  fairy: "#F4B1F4",
  fighting: "#823551D",
  fire: "#E73B0C",
  flying: "#A3B3F7",
  ghost: "#6060B2",
  grass: "#74C236",
  ground: "#D3B357",
  ice: "#A3E7FD",
  normal: "#C8C4BC",
  poison: "#934594",
  psychic: "#ED4882",
  rock: "#B9A156",
  steel: "#B5B5C3",
  water: "#3295F6",
};

const Badge = ({ type }: { type: string }) => (
  <span
    className="inline-block px-3 py-1 text-sm font-semibold text-white rounded-full capitalize"
    style={{ backgroundColor: TYPE_COLORS[type] }}
  >
    {type}
  </span>
);

const Elementpage = () => {
  const [pokeDetails, setPokeDetails] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const param = useParams();
  const typeColor = TYPE_COLORS[param.name] || "#000000"; // Fallback to black if the type is not found

  useEffect(() => {
    const abortController = new AbortController();

    const loadPoke = async () => {
      try {
        setLoading(true);
        const res: AxiosResponse<{ pokemon: Array<{ pokemon: { name: string; url: string } }> }> = await axios.get(
          `https://pokeapi.co/api/v2/type/${param.name}`,
          {
            signal: abortController.signal,
          }
        );

        const pokemonDetailsPromises = res.data.pokemon.map(async (pokemonEntry) => {
          const detailsRes: AxiosResponse<PokemonDetails> = await axios.get(
            pokemonEntry.pokemon.url
          );
          return detailsRes.data;
        });
        const details = await Promise.all(pokemonDetailsPromises);
        setPokeDetails(details);
        setError("");
      } catch (error: any) {
        setError(`Something went wrong: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadPoke();
    return () => abortController.abort();
  }, [param.name]);

  return (
    <>
      <Navbar />
      <main className="py-8 px-4">
        <section className="flex items-center justify-between">
          <div className="">
            <h1 className="text-5xl font-bold capitalize" style={{ color: typeColor }}>
              {param.name} pokemon
            </h1>
          </div>
          <div className="">
            <Link href={"/type_category"}>
                <button className="btn bg-orange-500 text-white hover:bg-yellow-500 hover:text-white">
              <Layers3 />
            </button>
            </Link>
        
          </div>
        </section>
        <section className="py-4 px-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && pokeDetails.map((pokemon) => (
              <div key={pokemon.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <img
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold capitalize">{pokemon.name}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {pokemon.types.map((type) => (
                      <Badge key={type.slot} type={type.type.name} />
                    ))}
                  </div>
                  <Link href={`/poke/${pokemon.name}`}>
                    <button className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-orange-600 w-full">
                      Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default Elementpage;
