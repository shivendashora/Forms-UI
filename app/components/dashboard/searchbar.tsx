"use client";

import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"; 

export default function SearchBar({setSearch,search}:any) {

  return (
    <div className="flex items-center w-full max-w-md bg-gray-600 border border-gray-300 rounded-md px-3 py-1 h-9 shadow-sm">
      <MagnifyingGlassIcon className="w-4 h-4 text-white mr-2" />
      <Input
        placeholder="Search for the forms lists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border-none focus:ring-0 focus:outline-none px-0 h-full bg-gray-600 placeholder:text-white font-italic text-white "
      />
    </div>
  );
}
