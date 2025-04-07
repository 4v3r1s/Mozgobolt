import { useEffect, useState } from "react";
import { Button } from "../orderpage/Button";
import { Link, useNavigate } from "react-router-dom";

export default function OrderTutorial() {
  const [steps, setSteps] = useState([]);
  const navigate = useNavigate();
  const [logoAnimated, setLogoAnimated] = useState(false);

  useEffect(() => {
    setSteps([
      {
        title: "Termék kiválasztása",
        description: "Böngésszen a kínálatunkban és válassza ki a kívánt termékeket.",
        image: "/public/1.png"
      },
      {
        title: "Kosárba helyezés",
        description: "Kattintson a 'Kosárba' gombra a kiválasztott termék mellett.",
        image: "/public/2.png"
      },
      {
        title: "Vásárlás, kuponkód megadása",
        description: "Adja meg a kuponkódot, majd kattintson a 'Tovább a fizetéshez gombra.",
        image: "/public/3.png"
      },
      {
        title: "Szállítási adatok megadása",
        description: "Töltse ki a szállítási adatokat, majd kattintson a 'Rendelés elküldése gombra'.",
        image: "/public/4.png"
      },
      {
        title: "Rendelés véglegesítése",
        description: "Ellenőrizze a megadott adatokat és kattintson a 'Rendelés leadása' gombra.",
        image: "/public/5.png"
      }
    ]);
    
    // Animáció indítása késleltetéssel
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300); // 300ms késleltetés
    
    return () => clearTimeout(timer);
  }, []);

  const handleShopClick = () => {
    navigate('/');
  };

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
              <a href="/tutorial" className="text-white font-bold border-b-2 border-white">
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

      {/* Rendelési útmutató cím */}
      <div className="container mx-auto text-center py-6">
        <h1 className="text-2xl font-bold">Rendelési útmutató</h1>
      </div>

      <main className="container mx-auto px-4 py-8">
        

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Hogyan rendeljek?</h2>
          <p className="text-gray-700 mb-4">
            Az alábbiakban részletesen bemutatjuk a rendelési folyamatot, hogy könnyedén vásárolhasson webáruházunkban.
            Kövesse az alábbi lépéseket a sikeres rendeléshez.
          </p>
        </div>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
              </div>
              <p className="text-gray-700 mb-4">{step.description}</p>
              <div className="mt-4 flex justify-start">
                <img 
                  src={step.image} 
                  alt={`Lépés ${index + 1}`} 
                  className="rounded-lg shadow-md w-1/6 h-auto" 
                />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Gyakori kérdések a rendeléssel kapcsolatban</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Mennyi a szállítási idő?</h3>
              <p className="text-gray-700">A leadásnapjátót tekintve, másnap 12:00-ig megérkezika rendelés.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Hogyan fizethetek?</h3>
              <p className="text-gray-700">Fizethet bankkártyával helyben, vagy utánvéttel kézpénzel a rendelés átvételekor.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Mi a teendő, ha hibás terméket kaptam?</h3>
              <p className="text-gray-700">Kérjük, vegye fel velünk a kapcsolatot a contact@mozgoshop.hu email címen vagy a +36 1 234 5678 telefonszámon.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Meddig lehet lemondani a rendelést?</h3>
              <p className="text-gray-700">A rendelést a csomag feladásáig lehet lemondani. Ehhez kérjük, vegye fel velünk a kapcsolatot.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            onClick={handleShopClick}
            className="bg-red-700 text-white py-2 px-6 rounded-md hover:bg-red-800 transition-colors"
          >
            Vásárlás megkezdése
          </Button>
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
