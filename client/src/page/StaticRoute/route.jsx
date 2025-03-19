import { useEffect, useState } from "react";
import { Button } from "../orderpage/Button";

export default function Towns() {
  const [towns, setTowns] = useState([]);

  useEffect(() => {
    setTowns(["Budapest", "Debrecen", "Szeged", "Pécs", "Győr", "Miskolc", "Eger", "Nyíregyháza", "Székesfehérvár", "Kecskemét"]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-700 text-white py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold">Elérhető Települések</h1>
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
      </main>

      <footer className="bg-red-700 text-white mt-12 py-4 text-center">
        <p className="text-sm">© 2025 MozgoShop. Minden jog fenntartva.</p>
      </footer>
    </div>
  );
}