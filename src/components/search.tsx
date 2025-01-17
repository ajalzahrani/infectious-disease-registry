"use client"

import { useState } from "react"
import { SearchIcon } from 'lucide-react'
import { Input } from "@/components/ui/input"

export function Search() {
  const [search, setSearch] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality here
    console.log("Searching for:", search)
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full md:w-auto">
      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search patients..."
        className="pl-8 md:w-[300px]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  )
}

