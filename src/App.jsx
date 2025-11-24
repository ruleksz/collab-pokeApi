import { useState } from "react";
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';

function App() {
  const [search, setSearch] = useState("");

  return (
    <div className="bg-gray-800">
      <Navbar onSearchChange={setSearch} />
      <HomePage searchQuery={search} />
    </div>
  );
}

export default App;
