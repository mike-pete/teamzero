"use client";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function Home() {
  const search = api.search.search.useMutation();

  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submitting", address);
    setAddress("");
    search.mutate({ address: address.trim() });
  };

  if (search.data) {
    console.log("search data", search.data);
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 bg-zinc-50 p-8">
      <div className="flex flex-col gap-2">
        <p className="text-zinc-400 font-semibold text-lg">Find nearest bus stop for drop off</p>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="rounded-lg border-2 px-2 py-1 flex-grow rounded-r-none"
            placeholder="Address"
          />
          <button
            type="submit"
            className="rounded-lg border-2 bg-zinc-100 px-2 rounded-l-none border-l-0"
          >
            <IconSearch size={20} className="text-black/45" />
          </button>
        </form>
      </div>
    </div>
  );
}
