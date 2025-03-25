import { useEffect, useState } from "react";
import { Button } from "../orderpage/Button";

export default function info() {
  const [towns, setTowns] = useState([]);
  const [logoAnimated, setLogoAnimated] = useState(false);

  // Animáció indítása késleltetéssel az oldal betöltése után
  useEffect(() => {
    // Kis késleltetés, hogy biztosan látható legyen az animáció
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300); // 300ms késleltetés
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - animált MozgoShop felirattal */}
      <header className="bg-red-700 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center overflow-hidden h-10">
            <a href="/" className="text-white hover:text-gray-200">
              <h1 
                className={`text-2xl font-bold transition-all duration-1000 ease-in-out transform ${
                  logoAnimated ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                }`}
              >
                MozgoShop
              </h1>
            </a>
          </div>
        </div>
      </header>
      {/* Navigation */}      <nav className="bg-red-800 text-white">
        <div className="container mx-auto px-4">
          <ul className="flex overflow-x-auto whitespace-nowrap py-3 gap-6 text-sm font-medium">
            <li>
              <a href="/" className="hover:text-gray-200">
                KEZDŐLAP
              </a>
            </li>
            <li>
              <a href="/info" className="hover:text-gray-200">
                BEMUTATKOZÁS
              </a>
            </li>
            <li>
              <a href="/tutorial" className="hover:text-gray-200">
                RENDELÉS MENETE
              </a>
            </li>
            <li>
              <a href="/account" className="hover:text-gray-200">
                FIÓKOM
              </a>
            </li>
            <li>
              <a href="/sales" className="hover:text-gray-200">
                AKCIÓK
              </a>
            </li>
            <li>
              <a href="/utvonal" className="hover:text-gray-200">
                TELEPÜLÉSEK
              </a>
            </li>
            <li>
              <a href="/StaticKapcsolat" className="hover:text-gray-200">
                KAPCSOLAT
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Bemutatkozás cím */}
      <div className="container mx-auto text-center py-6">
        <h1 className="text-2xl font-bold">Bemutatkozás</h1>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Rólunk</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {towns.map((town, index) => (
                <li key={index} className="bg-gray-100 p-3 rounded-lg text-center font-medium text-gray-800">
                  {town}
                </li>
              ))}
            </ul>
        </div>

        {/* Új elkülönített rész a cégről szóló információkkal */}
        <div className="bg-white mt-6 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Küldetésünk</h2>
          <div className="prose max-w-none">
            <p className="mb-4">
              A MozgoShop 2025-ben alakult azzal a céllal, hogy friss és minőségi élelmiszereket juttasson el a vidéki településekre. 
              Küldetésünk, hogy megkönnyítsük azok életét, akik számára nehézséget jelent a bevásárlás.
            </p>
            <p className="mb-4">
              Szolgáltatásunk különösen fontos az idősebb korosztály számára, akik gyakran nem tudnak eljutni a nagyobb bevásárlóközpontokba. 
              Mozgóboltunk rendszeresen látogatja a környező településeket, megbízható menetrenddel és széles termékválasztékkal.
            </p>
            <p>
              Büszkék vagyunk arra, hogy a helyi közösségek részévé váltunk, és hogy nap mint nap hozzájárulhatunk az emberek kényelméhez és jóllétéhez.
              Célunk továbbra is az, hogy bővítsük szolgáltatásainkat és még több településre juttassuk el a minőségi élelmiszereket.
            </p>
          </div>
        </div>

        {/* Képrészek a szöveg alatt */}
        <div className="py-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Első képrész */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Cégünk logója</h3>
              <img 
                src="/images/logo.png" 
                alt="MozgoShop logó" 
                className="w-full h-auto rounded-lg shadow"
              />
            </div>
            
            {/* Második képrész */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Mozgóboltunk</h3>
              <img 
                src="/images/mozgobolt.jpg" 
                alt="Mozgóbolt" 
                className="w-full h-auto rounded-lg shadow"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/placeholder.jpg";
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-red-700 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">MozgoShop</h3>
              <p className="text-sm">Minőségi élelmiszerek széles választéka, gyors kiszállítással az Ön otthonába.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Kapcsolat</h3>
              <address className="not-italic text-sm">
                <p>1234 Budapest, Példa utca 123.</p>
                <p>Email: info@mozgoshop.hu</p>
                <p>Telefon: +36 1 234 5678</p>
              </address>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Információk</h3>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Általános Szerződési Feltételek
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Adatvédelmi Tájékoztató
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Szállítási Információk
                  </a>
                </li>
                <li>
                  <a href="/StaticKapcsolat" className="hover:underline">
                    Kapcsolat
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-red-600 mt-8 pt-6 text-sm text-center">
            <p>© 2025 MozgoShop. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
