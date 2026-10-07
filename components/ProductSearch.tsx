"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface ProductSearchItem {
  id: string;
  name: string;
  onSelect: () => void;
}

export default function ProductSearch({ value, onChange, items }: {
  value: string;
  onChange: (value: string) => void;
  items: ProductSearchItem[];
}) {
  const [focused, setFocused] = useState(false);
  const query = value.trim().toLowerCase();
  const matches = items.filter(item => item.name.toLowerCase().includes(query));
  return (
    <div className="relative w-full" onFocus={() => setFocused(true)} onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
    }} onKeyDown={event => { if (event.key === "Escape") setFocused(false); }}>
      <Input value={value} onChange={event => onChange(event.target.value)} aria-label="Search products by name" placeholder="Search products..." className="h-11 rounded-full bg-[#F6F7F6] pl-10 pr-10 text-base sm:text-sm" />
      <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
      {value && <button type="button" aria-label="Clear search" onClick={() => onChange("")} className="absolute right-2 top-1.5 flex h-8 w-8 items-center justify-center"><X className="h-4 w-4" /></button>}
      {focused && query && (
        <div className="absolute top-full z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
          <p className="sr-only" role="status">{matches.length} products found</p>
          {matches.length ? matches.map(item => (
            <button key={item.id} type="button" className="block w-full border-b px-4 py-3 text-left text-sm last:border-0 hover:bg-[#F2FBF4] focus:bg-[#F2FBF4]" onClick={() => { onChange(""); setFocused(false); item.onSelect(); }}>{item.name}</button>
          )) : <p className="px-4 py-4 text-sm text-gray-500">No products found.</p>}
        </div>
      )}
    </div>
  );
}
