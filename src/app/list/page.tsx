"use client";
import Navbar from "@/components/Navbar";
import { LayoutGrid, Rows2 } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";

const Listpage = () => {
  const [active, setActive] = useState<string>("list");

  return (
    <>
      <Navbar />
      <main className="py-8 px-4">
        <section className="flex gap-4 items-center justify-between">
          <div className="">
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
        main page
      </main>
    </>
  );
};

export default Listpage;
