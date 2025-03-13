import "./App.css";
import SearchInput from "./components/SearchInput";

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Product Search
          </h1>
          <SearchInput />
        </div>
      </div>
    </>
  );
}

export default App;
