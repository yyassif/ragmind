import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type BrainSearchBarProps = {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
};

export default function BrainSearchBar({
  searchQuery,
  setSearchQuery,
}: BrainSearchBarProps): JSX.Element {
  return (
    <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <form>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
}
