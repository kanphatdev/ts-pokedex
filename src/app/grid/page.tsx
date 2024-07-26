"use client";
import Navbar from "@/components/Navbar";
import { LayoutGrid, Rows2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

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

interface PokemonDetails {
  id: number;
  types: PokemonType[];
}

const Gridpage = () => {
  const [active, setActive] = useState<string>("grid");
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
        <section className="flex gap-4 items-center justify-between py-4">
          <div className="">
            <h1 className="text-5xl font-bold capitalize text-yellow-300">
              grid view
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

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {Loading && <p>Loading...</p>}
          {Error && <p>{Error}</p>}
          {PokeDetails.map((pokemon) => (
            <div key={pokemon.id} className="rounded overflow-hidden shadow-lg bg-white">
              <Image
                className="w-full"
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                alt={Poke?.results[pokemon.id - 1].name}
                width={200}
                height={200}
              />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 capitalize">
                  {Poke?.results[pokemon.id - 1].name}
                </div>
                <div className="text-gray-700 text-base">
                  {pokemon.types.map((typeInfo) => (
                    <span
                      key={typeInfo.slot}
                      className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2 capitalize"
                      style={{ backgroundColor: TYPE_COLORS[typeInfo.type.name] }}
                    >
                      {typeInfo.type.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="px-6 pt-4 pb-2">
                <button className="btn text-white hover:bg-yellow-500 w-full capitalize bg-orange-500">
                  detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Gridpage;
