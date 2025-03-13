import React from "react";

// const LoadingSpinner = () => (
//   <div className="flex justify-center p-4">
//     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
//   </div>
// );

const SearchInput: React.FC = () => {
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
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
