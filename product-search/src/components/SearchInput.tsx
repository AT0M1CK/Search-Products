import React, { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Virtuoso } from "react-virtuoso";
import { Search, Loader2 } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { cn } from "../lib/utils";
import type { Product } from "../types/product";

const ITEMS_PER_PAGE = 15;

export function SearchInput() {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      const response = await axios.get<Product[]>(
        `https://fakestoreapi.com/products?limit=${ITEMS_PER_PAGE}`
      );
      return response.data.filter((product) =>
        product.title.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    },
    enabled: debouncedQuery.length > 0,
  });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!data) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < data.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && data[selectedIndex]) {
            setSelectedProduct(data[selectedIndex]);
            setQuery(data[selectedIndex].title);
            setIsOpen(false);
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
      }
    },
    [data, selectedIndex]
  );

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setQuery(product.title);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  useEffect(() => {
    if (debouncedQuery) {
      setIsOpen(true);
    }
  }, [debouncedQuery]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => debouncedQuery && setIsOpen(true)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
          )}
        </div>

        {isOpen && (
          <div
            ref={listRef}
            className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border max-h-[300px] overflow-hidden z-10"
          >
            {error ? (
              <div className="p-4 text-red-500">Error fetching results</div>
            ) : !data?.length ? (
              <div className="p-4 text-gray-500">
                {debouncedQuery ? "No results found" : "Start typing to search"}
              </div>
            ) : (
              <Virtuoso
                style={{ height: "300px" }}
                totalCount={data.length}
                itemContent={(index) => {
                  const product = data[index];
                  return (
                    <div
                      key={product.id}
                      className={cn(
                        "p-2 cursor-pointer hover:bg-gray-100",
                        selectedIndex === index && "bg-blue-50"
                      )}
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium">{product.title}</div>
                          <div className="text-sm text-gray-500">
                            {product.category}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            )}
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex gap-6">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.title}
              className="w-32 h-32 object-cover rounded"
            />
            <div>
              <h3 className="text-xl font-semibold">{selectedProduct.title}</h3>
              <p className="text-gray-600 mt-1">{selectedProduct.category}</p>
              <p className="text-green-600 font-semibold mt-2">
                ${selectedProduct.price}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="text-yellow-400">★</div>
                <span>{selectedProduct.rating.rate}</span>
                <span className="text-gray-400">
                  ({selectedProduct.rating.count} reviews)
                </span>
              </div>
              <p className="mt-2 text-gray-600 line-clamp-2">
                {selectedProduct.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
