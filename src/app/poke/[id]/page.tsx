"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import Image from "next/image";
import { ArrowLeftToLine } from "lucide-react";
import Link from "next/link";

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
  base_experience: number;
}

interface PokemonSpecies {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
  capture_rate: number;
  egg_groups: {
    name: string;
    url: string;
  }[];
}

const Pokepage = () => {
  const { id } = useParams();
  const [Pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [Description, setDescription] = useState<string>("");
  const [Loading, setLoading] = useState<boolean>(false);
  const [Error, setError] = useState<string>("");
  const [CaptureRate, setCaptureRate] = useState<number | null>(null);
  const [EggGroups, setEggGroups] = useState<string[]>([]);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        const response: AxiosResponse<PokemonDetails> = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        setPokemon(response.data);
        const speciesResponse: AxiosResponse<PokemonSpecies> = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${id}`
        );
        const flavorTextEntry = speciesResponse.data.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        );
        setDescription(flavorTextEntry ? flavorTextEntry.flavor_text : "");
        setCaptureRate(speciesResponse.data.capture_rate);
        setEggGroups(speciesResponse.data.egg_groups.map((group) => group.name));
        setError("");
      } catch (error: any) {
        setError(`Something went wrong: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPokemonDetails();
    }
  }, [id]);

  if (Loading) return <p>Loading...</p>;
  if (Error) return <p>{Error}</p>;

  return (
    <div className="container mx-auto py-8">
      {Pokemon && (
        <div className="max-w-4xl mx-auto bg-white rounded shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4">
              <Image
                src={Pokemon.sprites.front_default}
                alt={Pokemon.name}
                width={200}
                height={200}
                className="object-contain mb-4"
              />
              <h1 className="text-4xl font-bold capitalize text-center mb-4">
                {Pokemon.name}
              </h1>
              <div className="flex flex-wrap justify-center mt-4">
                {Pokemon.types.map((typeInfo) => (
                  <span
                    key={typeInfo.slot}
                    className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2 capitalize"
                    style={{
                      backgroundColor: getTypeColor(typeInfo.type.name),
                    }}
                  >
                    {typeInfo.type.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative p-4 flex flex-col justify-center">
              <Link href={"/grid"}>
                <button className="absolute top-2 right-2 btn btn-ghost capitalize">
                  <ArrowLeftToLine /> back
                </button>
              </Link>

              <div className="card bg-base-100 w-96 shadow-xl">
                <p className="p-4">{Description}</p>
              </div>
              <div className="stats shadow mt-4">
                <div className="stat place-items-center">
                  <div className="stat-title capitalize">catch rate</div>
                  <div className="stat-value">{CaptureRate}</div>
                </div>

                <div className="stat place-items-center">
                  <div className="stat-title capitalize">base experience</div>
                  <div className="stat-value text-secondary">
                    {Pokemon.base_experience}
                  </div>
                </div>

                <div className="stat place-items-center">
                  <div className="stat-title capitalize">egg group</div>
                  <div className="stat-value">
                    {EggGroups.map((group, index) => (
                      <div
                        key={index}
                        className="badge badge-outline mr-1 capitalize"
                      >
                        {group}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getTypeColor = (type: string) => {
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
  return TYPE_COLORS[type] || "#777";
};

export default Pokepage;
