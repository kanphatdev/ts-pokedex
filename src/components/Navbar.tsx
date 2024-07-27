"use client";
import { GripHorizontal } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from "react";
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
  name: string;
  types: PokemonType[];
}

const Navbar = () => {
  const [Poke, setPoke] = useState<PokemonResponse | null>(null);
  const [Loading, setLoading] = useState<boolean>(false);
  const [Error, setError] = useState<string>("");
  const [PokeDetails, setPokeDetails] = useState<PokemonDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPoke, setFilteredPoke] = useState<PokemonDetails[]>([]);
  
  const pokemonTypes: string[] = [
    'bug',
    'dark',
    'dragon',
    'electric',
    'fairy',
    'fighting',
    'fire',
    'flying',
    'ghost',
    'grass',
    'ground',
    'ice',
    'normal',
    'poison',
    'psychic',
    'rock',
    'steel',
    'water'
  ];

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
        setFilteredPoke(details);
      } catch (error: any) {
        setError(`something went wrong: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    LoadPoke();
    return () => abortController.abort();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    if (value === "") {
      setFilteredPoke(PokeDetails);
    } else {
      setFilteredPoke(
        PokeDetails.filter(pokemon =>
          pokemon.name.toLowerCase().includes(value) || pokemon.id.toString().includes(value)
        )
      );
    }
  };

  return (
    <nav className="shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-yellow-500 text-xl capitalize font-bold">
          ts pokedex
        </div>
        <div className="relative w-1/2">
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <svg 
            className="w-6 h-6 text-gray-400 absolute left-3 top-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M21 21l-4.35-4.35M3.65 11a7.35 7.35 0 1014.7 0 7.35 7.35 0 00-14.7 0z"
            />
          </svg>
          {searchTerm && (
            <div className="absolute w-full bg-white border border-gray-300 mt-1 rounded-lg z-10 max-h-60 overflow-y-auto">
              {filteredPoke.map(pokemon => (
                <Link key={pokemon.id} href={`/poke/${pokemon.id}`}>
                  <button className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-200 capitalize">
                    <div className="flex items-center justify-between gap-4">
                      <div className=" text-orange-500">
                        #{pokemon.id}
                      </div>
                      <div className="text-yellow-500">
                       {pokemon.name} 
                      </div>
                    </div>
                      
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div>
          <details className="dropdown">
            <summary className="btn m-1 capitalize bg-yellow-500 hover:bg-orange-500 text-white">
              <GripHorizontal /> poke element
            </summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              {pokemonTypes.map((type) => (
                <li key={type}>
                  <Link href={`/element/${type}`} className="capitalize">{type}</Link>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
