import { House } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const TYPE_COLORS: { [key: string]: string } = {
  bug: "#B1C12E",
  dark: "#4F3A2D",
  dragon: "#755EDF",
  electric: "#FCBC17",
  fairy: "#F4B1F4",
  fighting: "#FF7E6B",
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

// Function to calculate luminance of a color
const luminance = (color: string) => {
  const rgb = parseInt(color.substring(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // Standard luminance calculation
  return luma;
}

// Function to get a contrasting color (black or white)
const getContrastColor = (bgColor: string) => {
  return luminance(bgColor) > 128 ? 'black' : 'white';
}

const Category = () => {
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

  return (
    <main className='py-8 px-4 bg-gray-200'>
      <section className="flex items-center justify-between">
        <div className="">
          <h1 className="text-5xl font-bold capitalize text-orange-500">
            pokemon type categories
          </h1>
        </div>
        <div className="">
        <Link href={"/"}>
           <button className="btn bg-orange-500 text-white hover:bg-yellow-500 hover:text-white">
            <House />
          </button>
        </Link>
       
        </div>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 px-2">
        {pokemonTypes.map((type) => (
          <Link key={type} href={`/element/${type}`}>
            <button
              className="btn py-2 px-4 rounded w-full capitalize"
              style={{
                backgroundColor: TYPE_COLORS[type],
                color: getContrastColor(TYPE_COLORS[type])
              }}
            >
              {type}
            </button>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Category;
