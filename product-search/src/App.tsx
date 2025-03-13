import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchInput } from "./components/SearchInput";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
              Product Search
            </h1>
            <SearchInput />
          </div>
        </div>
      </QueryClientProvider>
    </>
  );
}

export default App;
