"use client";

import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, Star } from "lucide-react";

const filters = [
  { icon: <Clock className="h-4 w-4 mr-1" />, value: "New" },
  { icon: <TrendingUp className="h-4 w-4 mr-1" />, value: "Top" },
  { icon: <Star className="h-4 w-4 mr-1" />, value: "Best" },
] as const;

type Filter = (typeof filters)[number]["value"];

interface FilterTabsProps {
  selected: Filter;
  onSelect: (filter: Filter) => void;
}

export function FilterTabs({ selected, onSelect }: FilterTabsProps) {
  return (
    <div className="flex gap-2">
      {filters.map((f) => (
        <Button
          key={f.value}
          variant={f.value === selected ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(f.value)}
          className="flex items-center"
        >
          {f.icon}
          {f.value}
        </Button>
      ))}
    </div>
  );
}
