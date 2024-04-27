"use client";
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
    <div className="min-h-screen bg-zinc-50">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="rounded-lg border-2 px-2 py-0.5"
          placeholder="Address"
        />
        <button
          type="submit"
          className="rounded-lg border-2 bg-zinc-100 px-2 py-0.5"
        >
          Search
        </button>
      </form>
    </div>
  );
}
