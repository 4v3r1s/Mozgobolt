import { useEffect, useState } from "react";
import { Button } from "../orderpage/Button";
import { Link, useNavigate } from "react-router-dom";

export default function Towns() {
  const [towns, setTowns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTowns(["Budapest", "Debrecen", "Szeged", "Pécs", "Győr", "Miskolc", "Eger", "Nyíregyháza", "Székesfehérvár", "Kecskemét"]);
  }, []);

  const handleContactClick = () => {
    navigate('/contact');
  };

  const handleTutorialClick = () => {
    navigate('/tutorial');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-700 text-white py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold">Elérhető Települések</h1>
          <nav className="mt-4">
            <ul className="flex justify-center space-x-6">
              <li><Link to="/" className="text-white hover:underline">Főoldal</Link></li>
              <li><Link to="/utvonal" className="text-white hover:underline">Útvonal</Link></li>
              <li><Link to="/contact" className="text-white hover:underline">Kapcsolat</Link></li>
              <li><Link to="/info" className="text-white hover:underline">Információ</Link></li>
              <li><Link to="/tutorial" className="text-white hover:underline">Rendelési útmutató</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <img src="/images/town1.jpg" alt="Town 1" className="rounded-lg shadow-lg w-full" />
          <img src="/images/town2.jpg" alt="Town 2" className="rounded-lg shadow-lg w-full" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Városok Listája</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {towns.map((town, index) => (
              <li key={index} className="bg-gray-100 p-3 rounded-lg text-center font-medium text-gray-800">
                {town}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-8 text-center space-x-4">
          <Button 
            onClick={handleContactClick}
            className="bg-red-700 text-white py-2 px-6 rounded-md hover:bg-red-800 transition-colors"
          >
            Kapcsolat
          </Button>
          
          <Button 
            onClick={handleTutorialClick}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            Rendelési útmutató
          </Button>
        </div>
      </main>

      <footer className="bg-red-700 text-white mt-12 py-4 text-center">
        <p className="text-sm">© 2025 MozgoShop. Minden jog fenntartva.</p>
      </footer>
    </div>
  );
}