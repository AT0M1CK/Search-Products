import React, { useRef } from "react";
import { useProductSearch } from '../hooks/useProductSearch';
import { Product } from '../types/product';

const LoadingSpinner = () => (
  <div className="flex justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
  </div>
);

const SuggestionItem = React.memo(
  ({
    product,
    isSelected,
    onClick,
    onMouseEnter,
  }: {
    product: Product;
    isSelected: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
  }) => (
    <li
      className={`px-4 py-2 cursor-pointer ${
        isSelected ? "bg-blue-100" : "hover:bg-gray-100"
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex items-center">
        <img
          src={product.image}
          alt={product.title}
          className="w-8 h-8 object-contain mr-2"
        />
        <div className="truncate">{product.title}</div>
      </div>
    </li>
  )
);

const SearchInput: React.FC = () => {
    const {
    searchTerm,
    products,
    isLoading,
    isError,
    selectedIndex,
    setSelectedIndex,
    isOpen,
    selectProduct,
    isFetchingNextPage,
  } = useProductSearch();
  const dropdownRef = useRef<HTMLUListElement>(null);
  const lastItemRef = useRef<HTMLLIElement | null>(null);
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {isOpen && (
          <ul
            ref={dropdownRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {isLoading && products.length === 0 ? (
              <LoadingSpinner />
            ) : isError ? (
              <li className="px-4 py-2 text-red-500">Error fetching products. Please try again.</li>
            ) : products.length === 0 ? (
              <li className="px-4 py-2 text-gray-500">
                {searchTerm ? 'No products found' : 'Popular searches will appear here'}
              </li>
            ) : (
              products.map((product, index: any) => (
                <SuggestionItem
                  key={product.id}
                  product={product}
                  isSelected={index === selectedIndex}
                  onClick={() => selectProduct(product)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  ref={index === products.length - 1 ? lastItemRef : null}
                />
              ))
            )}
            {isFetchingNextPage && <LoadingSpinner />}
          </ul>
        )}
      </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
