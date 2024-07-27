"use client";
import Navbar from "@/components/Navbar";
import { LayoutGrid, Rows2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios, { AxiosResponse } from "axios";
import Image from "next/image";

interface PokemonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{ name: string; url: string }>;
}

interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

interface PokemonDetails {
  id: number;
  types: PokemonType[];
  abilities: PokemonAbility[];
}

const Listpage = () => {
  const [active, setActive] = useState<string>("list");
  const [Poke, setPoke] = useState<PokemonResponse | null>(null);
  const [Loading, setLoading] = useState<boolean>(false);
  const [Error, setError] = useState<string>("");
  const [PokeDetails, setPokeDetails] = useState<PokemonDetails[]>([]);
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

  useEffect(() => {
    let abortController = new AbortController();

    const LoadPoke = async () => {
      try {
        setLoading(true);
        let res: AxiosResponse<PokemonResponse> = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=1024&offset=0`,
          {
            signal: abortController.signal,
          }
        );
        setPoke(res.data);
        setError("");
        const pokemonDetailsPromises = res.data.results.map(async (pokemon) => {
          const detailsRes: AxiosResponse<PokemonDetails> = await axios.get(
            pokemon.url
          );
          return detailsRes.data;
        });
        const details = await Promise.all(pokemonDetailsPromises);
        setPokeDetails(details);
      } catch (error: any) {
        setError(`something went wrong: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    LoadPoke();
    return () => abortController.abort();
  }, []);

  return (
    <>
      <Navbar />
      <main className="py-8 px-4">
        <section className="flex gap-4 items-center justify-between">
          <div className="flex gap-4">
            <h1 className="text-5xl font-bold text-yellow-300 capitalize">
              list view
            </h1>
          </div>
          <div className="">
            <div className="join">
              <Link href={"/grid"}>
                <button
                  className={`btn join-item capitalize ${
                    active === "grid" ? "bg-yellow-300 text-white" : ""
                  }`}
                  onClick={() => setActive("grid")}
                >
                  grid view <LayoutGrid />
                </button>
              </Link>

              <Link href={"/list"}>
                <button
                  className={`btn join-item capitalize ${
                    active === "list" ? "bg-yellow-300 text-white" : ""
                  }`}
                  onClick={() => setActive("list")}
                >
                  list view <Rows2 />
                </button>
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-8 space-y-4">
          {Loading && <p>Loading...</p>}
          {Error && <p>{Error}</p>}
          {PokeDetails.map((pokemon) => (
            <Link
              key={pokemon.id}
              href={`/poke/${Poke?.results[pokemon.id - 1].name}`}
            >
              <div className="flex items-center border rounded p-4 shadow-lg bg-white cursor-pointer">
                <Image
                  className="w-20 h-20"
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                  alt={Poke?.results[pokemon.id - 1].name}
                  width={80}
                  height={80}
                />
                <div className="ml-4">
                  <div className="font-bold text-xl mb-2 capitalize">
                    {Poke?.results[pokemon.id - 1].name}
                  </div>
                  <div className="flex space-x-2 mb-2">
                    {pokemon.types.map((typeInfo) => (
                      <span
                        key={typeInfo.slot}
                        className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-white capitalize"
                        style={{
                          backgroundColor: TYPE_COLORS[typeInfo.type.name],
                        }}
                      >
                        {typeInfo.type.name}
                      </span>
                    ))}
                  </div>
                  <div className="text-gray-700 text-sm">
                    Abilities:{" "}
                    {pokemon.abilities
                      .map((ability) => ability.ability.name)
                      .join(", ")}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export default Listpage;
