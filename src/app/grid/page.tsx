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

const Gridpage = () => {
  const [active, setActive] = useState<string>("grid");
  const [Poke, setPoke] = useState<PokemonResponse | null>(null);
  const [Loading, setLoading] = useState<boolean>(false);
  const [Error, setError] = useState<string>("");

  useEffect(() => {
    let abortController = new AbortController();

    const LoadPoke = async () => {
      try {
        setLoading(true);
        let res: AxiosResponse<PokemonResponse> = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`,
          {
            signal: abortController.signal,
          }
        );
        setPoke(res.data);
        setError("");
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

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
            <img
              className="w-full"
              src="https://via.placeholder.com/400x200"
              alt="Card image"
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Card Title</div>
              <p className="text-gray-700 text-base">
                This is a simple card component made using Tailwind CSS. It
                contains an image, title, and some text content.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <button className="btn btn-active btn-ghost w-full capitalize">
                detail
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Gridpage;
