import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Towns() {
  const [towns1, setTowns1] = useState([]);
  const [towns2, setTowns2] = useState([]);
  const [logoAnimated, setLogoAnimated] = useState(false);

  useEffect(() => {
    // Első táblázat települései
    setTowns1(["Zalaszentmárton", "Zalaszentmihály", "Zalaigrice", "Alsórajk", "Kerecseny", "Orosztony", "Zalaszabar", "Esztergályhorváti", "Bókaháza", "Szentgyörgyvár", "Alsópáhok"]);
    // Második táblázat települései - csak 8 település
    setTowns2(["Kallósd", "Kehidakustány", "Zalaszentlászló", "Zalaszentgrót-Zalakoppány", "Zalavég", "Kisgörbő", "Vindornyafok", "Karmacs"]);
    
    // Animáció indítása késleltetéssel
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300); // 300ms késleltetés
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - animált MozgoShop felirattal és logóval */}
      <header className="bg-red-700 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center overflow-hidden h-10">
            <a href="/" className="text-white hover:text-gray-200 flex items-center">
            <img 
              src="/public/vándorbolt.png" 
              alt="MozgoShop Logo" 
              className={`h-16 -my-3 mr-3 transition-all duration-1000 ease-in-out transform ${
                logoAnimated ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
              }`}
            />
              <h1 
                className={`text-2xl font-bold transition-all duration-1000 ease-in-out transform ${
                  logoAnimated ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                }`}
              >
               Vándorbolt
              </h1>
            </a>
          </div>
        </div>
      </header>
      {/* Navigation */}
      <nav className="bg-red-800 text-white">
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
              <a href="/utvonal" className="text-white font-bold border-b-2 border-white">
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

      {/* Települések cím */}
      <div className="container mx-auto text-center py-6">
        <h1 className="text-2xl font-bold">Települések</h1>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Kisebb képek fehér kerettel */}
          <div className="flex justify-center">
            <img 
              src="ut1.png" 
              alt="Town 1" 
              className="rounded-lg shadow-lg w-3/4 border-4 border-white" 
            />
          </div>
          <div className="flex justify-center">
            <img 
              src="ut2.png" 
              alt="Town 2" 
              className="rounded-lg shadow-lg w-3/4 border-4 border-white" 
            />
          </div>
        </div>

        {/* Kiszállítási információ */}
        <div className="bg-red-100 p-4 rounded-lg shadow-md mb-8 text-center">
          <p className="text-lg font-medium text-red-800">
           A mozgóbolt 8:00-kor érkezik az első faluba, 12:00-kor éri el az utolsó települést.
           Kiszállítás ebben az időintervallumban várható.
          </p>
        </div>

        {/* Két táblázat egymás mellett */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Első táblázat */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Útvonalak - 1. körzet</h2>
            <ul className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {towns1.map((town, index) => (
                <li key={index} className="bg-gray-100 p-3 rounded-lg text-center font-medium text-gray-800">
                  {town}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Második táblázat */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Útvonalak - 2. körzet</h2>
            <ul className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {towns2.map((town, index) => (
                <li key={index} className="bg-gray-100 p-3 rounded-lg text-center font-medium text-gray-800">
                  {town}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

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
